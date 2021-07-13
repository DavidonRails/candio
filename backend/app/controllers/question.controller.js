const db = require("../models");
const Question_db = db.question;
const Quiz_db = db.quiz;
const Answer_db = db.questionAnswer;
const CanAnswer_db = db.candidateAnswer;
const Challenge_db = db.challenge;


const Op = db.Sequelize.Op;

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

getRandomInt= (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

getQA_Data = async (questionId) => {
    var question = await Question_db.findOne({
        where: {
            id: questionId
        }
    });
    
    var answers = await Answer_db.findAll({
        where: {
          question_id: questionId
        }
    });

    var item = {
        "id": question.id,
        "quiz_id": question.quiz_id,
        "query": entities.decode(question.query),
        "answers": answers
    }

    return item;
}

exports.startChallenge = async (req, res) => {
    if (!req.body.challenge_id) {
        return res.status(401).send({ message: "There is no ID for Challenge." });
    }

    var cId = req.body.challenge_id;
    var challenge = await Challenge_db.findOne({
        where: {
            id: cId
        }
    });
    
    await challenge.update({
        state: 1 // From 0 to 1 : Pledge agree, challenge started
    });

    let ques_List = [];
    let id_Lit = [];

    if(challenge) {
        id_Lit = challenge.question_list.split(',');
        
        var item = {
            "id": challenge.id,
            "user_id": challenge.user_id,
            "quiz_id": challenge.quiz_id,
            "question_list": id_Lit,
            "score": challenge.score,
            "state": challenge.state,
            "progress": challenge.progress,
            "createdAt": challenge.createdAt,
            "updatedAt": challenge.updatedAt    
        };
        
        return res.status(200).send(item);
    } else {
        return res.status(401).send({ message: "Sorry, Could not find challenge." });
    }
}

exports.getQueryForChallenge = async (req, res) => {
    if (!req.body.quiz_id) {
        return res.status(401).send({ message: "Please select an Assessment for Challenge." });
    }
    var quiz_id = req.body.quiz_id;

    if (!req.body.user_id) {
        return res.status(401).send({ message: "There is no Candidate id for Challenge." });
    }
    
    var user_id = req.body.user_id;

    var challenge = await Challenge_db.findOne({
        where: {
            user_id: user_id,
            quiz_id: quiz_id
        }
    });

    let ques_List = [];
    let id_Lit = [];

    if(challenge) {
        var updatedAt = new Date(challenge.updatedAt);
        var current = Date.now();
        var timeDiff = (current - updatedAt) / 1000;
        // when create new challenge or refresh challenge, check whether time over
        if(timeDiff > 60 * 60) {
            await challenge.update({
                state: 3 // 3 : challenge abstention by time-over
            });
        }
                
        id_Lit = challenge.question_list.split(',');
        
        for(var i = 0; i < id_Lit.length; i++) {
            var ques_id = Number.parseInt(id_Lit[i]);

            ques_List.push(await getQA_Data(ques_id));
        }

        var item = {
            "id": challenge.id,
            "user_id": challenge.user_id,
            "quiz_id": challenge.quiz_id,
            "question_list": id_Lit,
            "questions" : ques_List,
            "score": challenge.score,
            "state": challenge.state,
            "progress": challenge.progress,
            "createdAt": challenge.createdAt,
            "updatedAt": challenge.updatedAt    
        };
        
        return res.status(200).send(item);

    } else {
        var q = await Quiz_db.findOne({
            where: {
                id: quiz_id
            }
        });
        
            if (!q) {
                return res.status(404).send({ message: "There is no assessment." });
            }
    
            let quesLength = 10;
            if(q.ques_counts) quesLength = q.ques_counts;
      
            var result  = await Question_db.findAll();
                
            for(var i = 0; i < quesLength; i++) {
                if( result.length > 0 ) {
                    var rand = Math.floor(Math.random() * result.length);

                    id_Lit.push(result[rand].id);
                    
                    ques_List.push(await getQA_Data(result[rand].id));

                    result.slice(rand);
                }
            }

            var c = await Challenge_db.create({
                user_id: user_id,
                quiz_id: quiz_id,
                question_list: id_Lit.join(),
                state:  0, // 0: challenge created, 1 : Pledge agree, challenge started,  2 : challenge completed, 3 : challenge abstention
                progress: 0,
                score: 0
            });

            var item = {
                "id": c.id,
                "user_id": c.user_id,
                "quiz_id": c.quiz_id,
                "question_list": id_Lit,
                "questions" : ques_List,
                "score": c.score,
                "state": c.state,
                "progress": c.progress,
                "createdAt": c.createdAt,
                "updatedAt": c.updatedAt    
            };

            return res.status(200).send(item);

    }
};

exports.nextQuestion = async (req, res) => {
    
    if (!req.body.quiz_id) {
        return res.status(401).send({ message: "Please select an Assessment for Challenge." });
    }
    var quiz_id = req.body.quiz_id;

    if (!req.body.user_id) {
        return res.status(401).send({ message: "There is no Candidate id for Challenge." });
    }
    
    // CanAnswer_db
    var challenge_id = req.body.challenge_id;
    var user_id = req.body.user_id;
    var quiz_id = req.body.quiz_id;
    
    var question_id = req.body.question_id;
    var answer_id = req.body.answer_id;
    var isRight = false;

    if(answer_id != -1) {
        var qa = await Answer_db.findOne({
            where: {
                id: answer_id,
                question_id	: question_id
            }
        });
        
        if(qa.isCorrect) isRight = true;
    }

    var ca = await CanAnswer_db.create({
        challenge_id: challenge_id,
        user_id: user_id,
        quiz_id: quiz_id,
        question_id: question_id,
        answer_id:  answer_id,
        isRight: isRight
    });

    var challenge = await Challenge_db.findOne({
        where: {
            id: challenge_id
        }
    });

    if(challenge) {
        
        var state = 1 // In Challenge

        var progress = Number.parseInt(challenge.progress);
        var score = Number.parseInt(challenge.score);
        if(isRight) score += 1;  // Important : score system

        if(progress < challenge.question_list.split(',').length) {
            progress += 1;
        } 
        
        // At Next Question, Check whether Quiz is completed

        if(progress >= challenge.question_list.split(',').length) {
            state = 2; // Challenge Completed
        }

        var updatedAt = new Date(challenge.updatedAt);
        var current = Date.now();
        var timeDiff = (current - updatedAt) / 1000;

        // At Next Question, Check whether time over

        if(timeDiff > 60 * 60) {
            state = 3; // 3 : challenge abstention
        }

        await challenge.update({
            progress: progress,
            score: score,
            state: state
        });

        let id_Lit = challenge.question_list.split(',');


        var item = {
            "id": challenge.id,
            "user_id": challenge.user_id,
            "quiz_id": challenge.quiz_id,
            "question_list": id_Lit,
            "score": challenge.score,
            "state": challenge.state,
            "progress": challenge.progress
        };
        
        return res.status(200).send(item);

    } else {
        return res.status(401).send({ message: "Sorry. Could not get quiz" });
    }

};