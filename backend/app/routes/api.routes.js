const { authJwt } = require("../middleware");
const UsersController = require("../controllers/user.controller");
const CompanyController = require("../controllers/company.controller");
const QuizController = require("../controllers/quiz.controller");
const QuestionsController = require("../controllers/question.controller");
const ProfileController = require("../controllers/profile.controller");
const JobController = require("../controllers/job.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/companys",
    CompanyController.getAll
  );

  app.post(
    "/api/assessments",
    QuizController.getAll
  );

  app.post(
    "/api/questions",
    QuestionsController.getQueryForChallenge
  );
  
  app.post(
    "/api/startChallenge",
    QuestionsController.startChallenge
  );

  app.post(
    "/api/nextQuestion",
    QuestionsController.nextQuestion
  );

  app.post(
    "/api/candidateProfile",
    ProfileController.getCandidateProfile
  );
  
  app.post(
    "/api/updateResume",
    ProfileController.updateResume
  );

  app.post(
    "/api/updateBasicProfile",
    ProfileController.updateBasicProfile
  );
  
  app.post(
    "/api/updateExperience",
    ProfileController.updateExperience
  );

  app.post(
    "/api/removeExperience",
    ProfileController.removeExperience
  );

  app.post(
    "/api/removeExpProject",
    ProfileController.removeExpProject
  );

  app.post(
    "/api/updateSide",
    ProfileController.updateSide
  );
  
  app.post(
    "/api/removeSideProject",
    ProfileController.removeSideProject
  );
  
  app.post(
    "/api/getAllJobsForCompany",
    JobController.getAllJobsForCompany
  );

  
  app.post(
    "/api/getJobDetail",
    JobController.getJobDetail
  );
  
  app.post(
    "/api/saveJob",
    JobController.saveJob
  );
  
  app.post(
    "/api/publishJob",
    JobController.publishJob
  );
  
  app.post(
    "/api/archieveJob",
    JobController.archieveJob
  );

  app.post(
    "/api/getCandidateForJob",
    JobController.getCandidateForJob
  );

  // Email Process

  app.post(
    "/api/sendInvitation",
    JobController.sendInvitation
  );


};
