const db = require("../models");
const User_db = db.user;
const Quiz_db = db.quiz;
const Challenge_db = db.challenge;

exports.getAll = async (req, res) => {
  if (!req.body.user_id) {
    return res.status(401).send({ message: "There is no Candidate id for Challenge." });
  }

  var user_id = req.body.user_id;
  
  var assess = await Quiz_db.findAll();

  var result = [];

  for(var i = 0; i < assess.length; i++) {

    var challenge = await Challenge_db.findOne({
      where: {
          user_id: user_id,
          quiz_id: assess[i].id
      }
    });

    if(challenge && challenge.state == 1) // If Challenge is in Progress
    {
      var updatedAt = new Date(challenge.updatedAt);
      var current = Date.now();
      var timeDiff = (current - updatedAt) / 1000;
  
      // At Next Question, Check whether time over
  
      if(timeDiff > 60 * 60) {
        await challenge.update({
          state: 3 // 3 : challenge abstention
        });
      }
    }

    var item = {
      "id": assess[i].id,
      "assessment": assess[i].assessment,
      "label": assess[i].label,
      "summary": assess[i].summary,
      "description": assess[i].description,
      "category": assess[i].category,
      "ques_counts": assess[i].ques_counts,
      "challenge" : challenge,
    };


    result.push(item);
  }

  return res.status(200).send(result);
  
};
