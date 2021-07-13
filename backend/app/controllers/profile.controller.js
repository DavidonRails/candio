const e = require("express");
const db = require("../models");

const User_db = db.user;

const Profile_db = db.profile;
const ProfileCompany_db = db.profileCompany;
const ProfileProject_db = db.profileProject;


const Op = db.Sequelize.Op;

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

getAllCompanyAndProject = (pId, userId, callback) => {
    ProfileCompany_db.findAll({
        where: {
            profileId: pId,
            userId: userId
        },
        include: [
          {
            model: ProfileProject_db,
          }
        ]
      }).then(experiences => {
        
        const resObj = experiences.map(exp => {
  
          //tidy up the company data
          return Object.assign(
            {},
            {
                id : exp.id,
                userId : exp.userId,
                profileId : pId,
                position: exp.position,
                company_name : exp.company_name, 
                start_date :  exp.start_date,
                end_date : exp.end_date,
    
                projects: exp.profile_projects.map(project => {
    
                    //tidy up the post data
                    return Object.assign(
                    {},
                    {
                        id: project.id,
                        userId: project.userId,
                        profileCompanyId: project.profileCompanyId,
                        project_name: project.project_name,
                        summary: project.summary,
                        outcome: project.outcome,
                        url: project.url,
                        skills: project.skills,
                        images: project.images

                    }
                    )
                })
            }
          )
        });

        callback(resObj);
      });
}

exports.getCandidateProfile = async (req, res) => { 
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no candidate id." });
    }

    var userId = req.body.userId;

    var user = await User_db.findByPk(userId);

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    var p = await Profile_db.findOne({
        where: {
            userId: userId
        }
    });

    if(!p) {
        p = await Profile_db.create({
            userId: userId,
            resume: null,
            shared_name: null,
            summary:  null,
            education_degree: null,
            education_university: null,
            education_start_date: null,
            education_end_date: null
        });
    }

    var side_projects = await ProfileProject_db.findAll({
        where: {
            userId: userId,
            profileCompanyId: null
        }
    });

    var result = {
        "profileId": p.id,
        "userId": p.userId,
        "photoURL": user.photoURL,
        "resume": p.resume,
        "shared_name": p.shared_name, 
        "summary":  p.summary,
        "education_degree": p.education_degree,
        "education_university": p.education_university,
        "education_start_date": p.education_start_date,
        "education_end_date": p.education_end_date,
        "side_projects" : side_projects
    };

    await getAllCompanyAndProject(p.id, userId, (data) => {
        result['experience'] = data;
        return res.status(200).send(result);
    });

    

    
    // end
}

exports.updateResume = async  (req, res) => {
    if (!req.body.profileId) {
        return res.status(401).send({ message: "There is no candidate profile id." });
    }
    var profileId = req.body.profileId;

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no candidate id." });
    }
    var userId = req.body.userId;

    var p = await Profile_db.findOne({
        where: {
            id: profileId,
            userId: userId
        }
    });

    await p.update({
        resume: req.body.resume
    });

    return res.status(200).send("success");
}


exports.updateBasicProfile = async  (req, res) => {
    if (!req.body.profileId) {
        return res.status(401).send({ message: "There is no candidate profile id." });
    }
    var profileId = req.body.profileId;

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no candidate id." });
    }
    var userId = req.body.userId;

    var user = await User_db.findByPk(userId);

    await user.update({
        photoURL: req.body.photoURL
    });

    var p = await Profile_db.findOne({
        where: {
            id: profileId,
            userId: userId
        }
    });

    await p.update({
        photoURL: req.body.photoURL,
        shared_name: req.body.shared_name,
        summary: req.body.summary,
        education_degree: req.body.education_degree,
        education_university: req.body.education_university,
        education_start_date: req.body.education_start_date,
        education_end_date: req.body.education_end_date
    });

    return res.status(200).send("success");
}

updateProjects = async (comId, userId, projects) => {
    var result = [];

    for(let i = 0; i < projects.length; i++) {
        let pro = projects[i];

        if(pro.removed) { // Flag to remove Project
            if(pro.id) { // Exist Project
                await ProfileProject_db.destroy({
                    where: {
                        id: pro.id
                    }
                });
            }
        } else { 
            let img = [];
            if(pro.images.length) {
                pro.images.forEach((e) => {
                    img.push(e.path);
                });
                img = img.join();
            } else {
                img = null;
            }

            let skill = pro.skills.join();

            if(pro.id) { // Exist Project
                var p = await ProfileProject_db.findOne({
                    where: {
                        id: pro.id,
                        profileCompanyId: comId,
                        userId: userId
                    }
                });

                if(p) {
                    await p.update({
                        project_name: pro.project_name,
                        outcome: pro.outcome,
                        summary: pro.summary,
                        url: pro.url,
                        skills: skill,
                        images: img,
                        
                    });           
                }
                result.push(p);
            } else { // New Project
                var p = await ProfileProject_db.create({
                    userId: userId,
                    profileCompanyId: comId,

                    project_name: pro.project_name,
                    outcome: pro.outcome,
                    summary: pro.summary,
                    url: pro.url,
                    skills: skill,
                    images: img,
                });
                result.push(p);
            }
        }
    }

    return result;
}


exports.updateExperience = async (req, res) => {
    
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no candidate id." });
    }
    var userId = req.body.userId;

    if (!req.body.profileId) {
        return res.status(401).send({ message: "There is no candidate profile id." });
    }
    var profileId = req.body.profileId;

    let com = null;

    if (!req.body.id) {
        com = await ProfileCompany_db.create({
            userId: userId,
            profileId: profileId,
            company_name: req.body.company_name,
            position: req.body.position,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        });
        
        if(req.body.projects.length) {
            com = com.toJSON();
            com['projects'] = await updateProjects(com.id, userId, req.body.projects)
        }
        
        // return res.status(200).send(com);

    } else {
        var comId = req.body.id;

        com = await ProfileCompany_db.findOne({
            where: {
                id: comId,
                userId: userId,
                profileId: profileId
            }
        });
    
        if(!com) {
            return res.status(401).send({ message: "Sorry! Cloud not find experience." });
        }

        await com.update({
            company_name: req.body.company_name,
            position: req.body.position,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        });

        if(req.body.projects.length) {
            com = com.toJSON();
            com['projects'] = await updateProjects(comId, userId, req.body.projects)
        }

        // return res.status(200).send(com);
    }

    await getAllCompanyAndProject(profileId, userId, (data) => {
        return res.status(200).send(data);
    });

}

exports.removeExperience = async (req, res) => {
    
    if (!req.body.id) {
        return res.status(401).send({ message: "There is no experience id." });
    }

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no user id." });
    }

    if (!req.body.profileId) {
        return res.status(401).send({ message: "There is no profile id." });
    }

    var comId = req.body.id;
    var userId = req.body.userId;
    var profileId = req.body.profileId;

    // Delete Projects

    await ProfileProject_db.destroy({
        where: {
            profileCompanyId: comId
        }
    });

    // Delete Company

    await ProfileCompany_db.destroy({
        where: {
            id: comId
        }
    });

    await getAllCompanyAndProject(profileId, userId, (data) => {
        return res.status(200).send(data);
    });

}


exports.removeExpProject = async (req, res) => {
    
    if (!req.body.id) {
        return res.status(401).send({ message: "There is no project id." });
    }

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no user id." });
    }

    var projectId = req.body.id;
    var userId = req.body.userId;

    // Delete Projects

    await ProfileProject_db.destroy({
        where: {
            id: projectId,
            userId: userId
        }
    });

    await getAllCompanyAndProject(profileId, userId, (data) => {
        return res.status(200).send(data);
    });

}

exports.removeSideProject = async (req, res) => {
    
    if (!req.body.id) {
        return res.status(401).send({ message: "There is no project id." });
    }

    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no user id." });
    }

    var projectId = req.body.id;
    var userId = req.body.userId;

    // Delete Projects

    await ProfileProject_db.destroy({
        where: {
            id: projectId,
            userId: userId,
            profileCompanyId: null,
        }
    });

    var result = await ProfileProject_db.findAll({
        where: {
            userId: userId,
            profileCompanyId: null,
        }
    });

    return res.status(200).send(result);

}

exports.updateSide = async (req, res) => {
    
    if (!req.body.userId) {
        return res.status(401).send({ message: "There is no candidate id." });
    }
    var userId = req.body.userId;

    if (!req.body.profileId) {
        return res.status(401).send({ message: "There is no candidate profile id." });
    }
    var profileId = req.body.profileId;

    let result = null;

    if(req.body.projects.length) {
        
        result = await updateSideProjects(userId, req.body.projects)
    }

    return res.status(200).send(result);
    
}

updateSideProjects = async (userId, projects) => {
    var result = [];

    for(let i = 0; i < projects.length; i++) {
        let pro = projects[i];

        if(pro.removed) { // Flag to remove Project
            if(pro.id) { // Exist Project
                await ProfileProject_db.destroy({
                    where: {
                        id: pro.id
                    }
                });
            }
        } else { 
            let img = [];

            if(pro.images && pro.images.length > 0) {
                pro.images.forEach((e) => {
                    img.push(e.path);
                });
                img = img.join();
            } else {
                img = null;
            }

            let skill = pro.skills.join();

            if(pro.id) {
                var p = await ProfileProject_db.findOne({
                    where: {
                        id: pro.id,
                        userId: userId
                    }
                });

                if(p) {
                    await p.update({
                        profileCompanyId: null,
                        project_name: pro.project_name,
                        summary: pro.summary,
                        url: pro.url,
                        skills: skill,
                        images: img,
                        
                    });
                }
                result.push(p);
            } else {
                var p = await ProfileProject_db.create({
                    userId: userId,
                    profileCompanyId: null,

                    project_name: pro.project_name,
                    outcome: pro.outcome,
                    summary: pro.summary,
                    url: pro.url,
                    skills: skill,
                    images: img,
                });
                result.push(p);
            }
        }
    }

    return result;
}
