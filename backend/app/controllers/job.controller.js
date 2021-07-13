const config = require("../config/db.config.js");

const e = require("express");
const db = require("../models");
// const nodemailer = require('nodemailer'); 
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API);

const User_db = db.user;

const Profile_db = db.profile;
const Company_db = db.company;
const Job_db = db.job;
const JobAppForm_db = db.jobApplicationForm;
const JobQuiz_db = db.jobQuiz;
const JobManagement_db = db.jobManagement;
const Challenge_db = db.challenge;

const Quiz_db = db.quiz;

const Op = db.Sequelize.Op;

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();


// create and update

exports.saveJob = async (req, res) => { 
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no company id." });
    }

    var userId = req.body.userId;
    var user = await User_db.findByPk(userId);

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    var company = await Company_db.findOne({
        where: {
            id: user.company_id
        }
    });

    let keyword = null;
    if(req.body.keyword)
        keyword = req.body.keyword.join();

    var result = null;

    // Save Job

    if(req.body.id) {
        var job = await Job_db.findOne({
            where: {
                id: req.body.id,
                userId: userId,
                companyId: company.id
            }
        });

        if (!job) {
            return res.status(404).send({ message: "Job Not found." });
        } else {
            result = await job.update({
                title: req.body.title,
                department:  req.body.department,
                industry: req.body.industry,
                code: req.body.code,
                country: req.body.country,
                region: req.body.region,
                remote: req.body.remote,
                education: req.body.education,
                function: req.body.function,
                employmentType: req.body.employmentType,
                experience: req.body.experience,
                keyword: keyword,
                fromSalary: req.body.fromSalary,
                toSalary: req.body.toSalary,
                currency: req.body.currency,
                status: req.body.status ? req.body.status : 0
            });
        }
    } else {
        result = await Job_db.create({
            userId: userId,
            companyId: company.id,
            title: req.body.title,
            department:  req.body.department,
            industry: req.body.industry,
            code: req.body.code,
            country: req.body.country,
            region: req.body.region,
            remote: req.body.remote,
            education: req.body.education,
            function: req.body.function,
            employmentType: req.body.employmentType,
            experience: req.body.experience,
            keyword: keyword,
            fromSalary: req.body.fromSalary,
            toSalary: req.body.toSalary,
            currency: req.body.currency,
            status: req.body.status ? req.body.status : 0
        });
    }

    result = result.toJSON();

    // Save Job Application Form

    var form = null;

    if(req.body.application && req.body.application.id && req.body.application.jobId) {
        form = await JobAppForm_db.findOne({
            where: {
                id: req.body.application.id,
                userId: userId,
                companyId: company.id,
                jobId : req.body.application.jobId,
            }
        });

        if (!form) {
            form = await JobAppForm_db.create({
                userId: userId,
                companyId: company.id,
                jobId: result.id,
                /*
                name: req.body.application.name,
                email:  req.body.application.email,
                headline: req.body.application.headline,
                phone: req.body.application.phone,
                address: req.body.application.address,
                photo: req.body.application.photo,
                education: req.body.application.education,
                experience: req.body.application.experience,
                summary: req.body.application.summary,
                resume: req.body.application.resume,
                coverletter: req.body.application.coverletter
                */
            });    
        } else {
            form = await form.update({
                name: req.body.application.name,
                email:  req.body.application.email,
                headline: req.body.application.headline,
                phone: req.body.application.phone,
                address: req.body.application.address,
                photo: req.body.application.photo,
                education: req.body.application.education,
                experience: req.body.application.experience,
                summary: req.body.application.summary,
                resume: req.body.application.resume,
                coverletter: req.body.application.coverletter
            });
        }
    } else {
        form = await JobAppForm_db.create({
            userId: userId,
            companyId: company.id,
            jobId: result.id,
            /*
            name: req.body.application.name,
            email:  req.body.application.email,
            headline: req.body.application.headline,
            phone: req.body.application.phone,
            address: req.body.application.address,
            photo: req.body.application.photo,
            education: req.body.application.education,
            experience: req.body.application.experience,
            summary: req.body.application.summary,
            resume: req.body.application.resume,
            coverletter: req.body.application.coverletter
            */
        });
    }

    form = form.toJSON();

    // Save Job Quiz

    var quizList = [];
    
    if(req.body.application.questions) {
        
        var questions = req.body.application.questions;
        
        if(questions.length) {
            
            for(let i = 0; i < questions.length; i++) {
                let q = questions[i];
                let qTemp = null;
                let answers = [];

                if(q.answers.length) {
                    q.answers.forEach((a) => {
                        answers.push(a.label);
                    });
                    answers = answers.join();
                } else {
                    answers = null;
                }

                if(q.id) {
                    qTemp = await JobQuiz_db.findOne({
                        where: {
                            id: q.id,
                            jobId : result.id,
                        }
                    });

                    qTemp = await qTemp.update({
                        quiz: q.quiz,
                        type: JSON.stringify(q.type),
                        answers: answers
                    });
                    
                } else {
                    qTemp = await JobQuiz_db.create({
                        jobId : result.id,
                        quiz: q.quiz,
                        type: JSON.stringify(q.type),
                        answers: answers
                    });

                }

                qTemp = qTemp.toJSON();

                quizList.push(qTemp);
            }

            
        }
    }

    form['questions'] = quizList;

    result['application'] = form;

    return res.status(200).send(result);
    // end
}

exports.publishJob = async (req, res) => {
    if (!req.body.jobId) {
        return res.status(401).send({ message: "There is no job id." });
    }

    var job = await Job_db.findOne({
        where: {
            id: req.body.jobId
        }
    });

    if (!job) {
        return res.status(404).send({ message: "Job Not found." });
    } else {
        // 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved
        result = await job.update({
            status: 3
        });

        return res.status(200).send("success");
    }

}

exports.archieveJob = async (req, res) => {
    if (!req.body.jobId) {
        return res.status(401).send({ message: "There is no job id." });
    }

    var job = await Job_db.findOne({
        where: {
            id: req.body.jobId
        }
    });

    if (!job) {
        return res.status(404).send({ message: "Job Not found." });
    } else {
        // 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved
        result = await job.update({
            status: 4
        });

        return res.status(200).send("success");
    }

}

searchCandidatesForJob = async (jobId) => {

    var job = await Job_db.findOne({
        where: {
            id: jobId
        }
    });

    if (!job) {
        return res.status(404).send({ message: "Job Not found." });
    } 

    if (!job.keyword) {
        return res.status(404).send({ message: "There is no job keyword to search Candidates." });
    }

    var keyword = job.keyword.split(',');

    var result = null;

    var userCondition = [];
    var quizCondition = [];

    for(let i = 0; i < keyword.length; i++) {
        var a = keyword[i];
        
        userCondition.push({
            skill: {
                [Op.like]: '%' + a + '%'
            }
        });

        quizCondition.push({
            assessment: {
                [Op.like]: '%' + a + '%'
            }
        });

    }

    var quiz = await Quiz_db.findAll({
        where: {
            [Op.or] : quizCondition
        }
    });

    var data = await User_db.findAndCountAll({
        where: {
            [Op.or] : userCondition
        }
        /*
        include: [
          { model : JobAppForm_db, required: true},
          { model: JobQuiz_db},
        ],
        limit: req.body.limit,
        offset: req.body.offset
        */
    });
    
    
    let count = data.count;
    let candidates = data.rows;

    var resObj = [];

    for(let j = 0; j < candidates.length; j++) {
        var can = candidates[j].toJSON();

        var profile = await Profile_db.findOne({
            where: {
                userId: can.id
            }
        });

        var calCondition = [];
        for(let i = 0; i < quiz.length; i++) {
            
            calCondition.push({
                user_id: can.id,
                quiz_id: quiz[i].id
            });
        }
    
        var assessment = await Challenge_db.findAll({
            where: {
                [Op.or] : calCondition
            }
        });

        var fitRating = [];
        
        if(assessment) {
            
            for(let k = 0; k < assessment.length; k++) {
                var score = assessment[k].score / assessment[k].progress;
                if(score < 0) score = 0;
                if(score > 1) score = 1;

                var skill = await Quiz_db.findOne({
                    where: {
                        id: assessment[k].quiz_id
                    }
                });

                fitRating.push(
                    {
                        skill: skill.assessment,
                        score: score
                    }
                );
            }
        }

        can['fitRating'] = fitRating;

        var applicationScore = 0.0;
        
        var m = await JobManagement_db.findOrCreate(
            {
                where: { candidateId : can.id},
                defaults: {
                    jobId: jobId,
                    application: 0,
                    stage: 0,
                    fitRating: JSON.stringify(fitRating),
                    applicationScore: applicationScore
                }
            }
        ).spread((xlsxStatus, created)=>{ 
            var obj = xlsxStatus['dataValues'];
            
            if(!created) {
                JobManagement_db.update({fitRating: JSON.stringify(fitRating)}, { where: {id:obj.id} });        
            }

            can['jobManagementId'] = obj.id;
            can['stage'] = obj.stage;
            can['application'] = obj.application;
            can['applicationScore'] = obj.applicationScore;

            can['resume'] = profile['resume'];
            can['shared_name'] = profile['shared_name'];
        });

        resObj.push(can);
    }
    
    return {
        "candidates": resObj,
        "count": count
    };
}

exports.getCandidateForJob = async (req, res) => { 

    if (!req.body.jobId) {
        return res.status(401).send({ message: "There is no Job id." });
    } 

    var result  = await searchCandidatesForJob(req.body.jobId);

    return res.status(200).send(result);

}

exports.getAllJobsForCompany = async (req, res) => {
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no company id." });
    }

    var userId = req.body.userId;
    var user = await User_db.findByPk(userId);

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    var company = await Company_db.findOne({
        where: {
            id: user.company_id
        }
    });

    var search = req.body.search;
    
    var jobState = req.body.jobState; 

    var result = null;

    var whereStatement = {};

    if(userId)
        whereStatement.userId = userId;

    if(company)
        whereStatement.companyId = company.id;
    
    if(search) {
       whereStatement = { 
            [Op.or] : [
            {
                title: {
                    [Op.like]: '%' + search + '%'
                }
            },
            {
                keyword: {
                    [Op.like]: '%' + search + '%'
                }
            }
        ]};
    }
      
    if(jobState)
        whereStatement.status = jobState;

    var orderBy = req.body.orderBy;
    var orderDir = req.body.orderDirect;

    if(!orderBy) orderBy = 'title';
    if(!orderDir) orderDir = 'DESC';
    
    Job_db.findAndCountAll({
        where: whereStatement,
        order: [
            [orderBy, orderDir]
        ],
        include: [
          { model : JobAppForm_db, required: true},
          { model: JobQuiz_db},
        ],
        limit: req.body.limit,
        offset: req.body.offset
    }).then((data) => {
        
        let count = data.count;
        let jobs = data.rows;

        const resObj = jobs.map(job => {
            
            return Object.assign(
                {},
                {
                    id : job.id,
                    userId : job.userId,
                    companyId : job.companyId,
                    
                    title : job.title, 
                    position: job.position,
                    department :  job.department,
                    industry : job.industry,
                    code: job.code,
                    country: job.country,
                    region: job.region,
                    remote: job.remote,
            
                    function: job.function,
                    employmentType: job.employmentType,
                    experience: job.experience,
                    education: job.education,
                    keyword: job.keyword,
                    fromSalary: job.fromSalary,
                    toSalary: job.toSalary,
                    currency: job.currency,
                    status: job.status,
                    
                    application: {
                        id: job.job_application_form.id,
                        userId: job.job_application_form.userId,
                        companyId: job.job_application_form.companyId,
                        jobId: job.job_application_form.jobId,
                        name: job.job_application_form.name,
                        email: job.job_application_form.email,
                        headline: job.job_application_form.headline,
                        phone: job.job_application_form.phone,
                        address: job.job_application_form.address,
                        photo: job.job_application_form.photo,
                        education: job.job_application_form.education,
                        experience: job.job_application_form.experience,
                        summary: job.job_application_form.summary,
                        resume: job.job_application_form.resume,
                        coverletter: job.job_application_form.coverletter,

                        questions: job.job_quizs // important
                    }
                }
            )
        });
        
        result = {
            "company": company,
            "jobs": resObj,
            "count": count,
            "where": orderDir
        };

        return res.status(200).send(result);

    }).catch((err) => {
        var result = {
            "error": err
        };
        return res.status(400).send(result);
    });
}

exports.getJobDetail = async (req, res) => {

    if (!req.body.id) {
        return res.status(401).send({ message: "There is no job id." });
    }
    var jobId = req.body.id;

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no company id." });
    }

    var userId = req.body.userId;
    var user = await User_db.findByPk(userId);

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    var company = await Company_db.findOne({
        where: {
            id: user.company_id
        }
    });

    var result = null;

    Job_db.findOne({
        where: {
            id: jobId,
            userId: userId,
            companyId: company.id,
        },
        include: [
          { model: JobQuiz_db },
          { model : JobAppForm_db }
        ]
    }).then(job => {
        
        const resObj =  Object.assign(
            {},
            {
                id : job.id,
                userId : job.userId,
                companyId : job.companyId,
                
                title : job.title, 
                position: job.position,
                department :  job.department,
                industry : job.industry,
                code: job.code,
                country: job.country,
                region: job.region,
                remote: job.remote,
        
                function: job.function,
                employmentType: job.employmentType,
                experience: job.experience,
                education: job.education,
                keyword: job.keyword,
                fromSalary: job.fromSalary,
                toSalary: job.toSalary,
                currency: job.currency,
                status: job.status,
                
                application: {
                    id: job.job_application_form.id,
                    userId: job.job_application_form.userId,
                    companyId: job.job_application_form.companyId,
                    jobId: job.job_application_form.jobId,
                    name: job.job_application_form.name,
                    email: job.job_application_form.email,
                    headline: job.job_application_form.headline,
                    phone: job.job_application_form.phone,
                    address: job.job_application_form.address,
                    photo: job.job_application_form.photo,
                    education: job.job_application_form.education,
                    experience: job.job_application_form.experience,
                    summary: job.job_application_form.summary,
                    resume: job.job_application_form.resume,
                    coverletter: job.job_application_form.coverletter,
                    questions: job.job_quizs
                }
            }
        );

        return res.status(200).send(resObj);

    }).catch(function(err) {
        return res.status(500).send(err);
    });
}

exports.sendInvitation = async (req, res) => { 
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no company id." });
    }

    var userId = req.body.userId;
    var user = await User_db.findByPk(userId);

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    if (!req.body.jobId) {
        return res.status(401).send({ message: "There is no job id." });
    }

    var job = await Job_db.findOne({
        where: {
            id: req.body.jobId
        }
    });

    if (!job) {
        return res.status(404).send({ message: "Job Not found." });
    }

    const msg = {
        to: 'david.ruby.rails@gmail.com',
        from: 'job@candio.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail.send(msg);

    return job;

}