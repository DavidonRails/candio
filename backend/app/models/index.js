const config = require("../config/db.config.js");
const roles = require("../config/role.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.company = require("../models/company.model")(sequelize, Sequelize);
db.quiz = require("../models/quiz.model")(sequelize, Sequelize);
db.question = require("../models/question.model")(sequelize, Sequelize);
db.questionAnswer = require("../models/questionAnswer.model")(sequelize, Sequelize);
db.candidateAnswer = require("../models/candidateAnswer.model")(sequelize, Sequelize);
db.challenge = require("../models/challenge.model")(sequelize, Sequelize);

db.profile = require("../models/profile.model")(sequelize, Sequelize);
db.profileCompany = require("../models/profileCompany.model")(sequelize, Sequelize);
db.profileProject = require("../models/profileProject.model")(sequelize, Sequelize);

db.job = require("../models/job.model")(sequelize, Sequelize);
db.jobApplicationForm = require("../models/jobApplicationForm.model")(sequelize, Sequelize);
db.jobQuiz = require("../models/jobQuiz.model")(sequelize, Sequelize);
db.jobManagement = require("../models/jobManagement.model")(sequelize, Sequelize);

// Candidate <=> Profile 
db.user.hasOne(db.profile);

db.profileCompany.belongsTo(db.profile);
db.profile.hasMany(db.profileCompany);

db.profileProject.belongsTo(db.profileCompany);
db.profileCompany.hasMany(db.profileProject);


// Company <=> Job

db.job.belongsTo(db.company);
db.company.hasMany(db.job);

db.jobApplicationForm.belongsTo(db.company);
db.company.hasMany(db.jobApplicationForm);

db.job.hasOne(db.jobApplicationForm);

db.jobQuiz.belongsTo(db.job);
db.job.hasMany(db.jobQuiz);

db.ROLES = [roles.SUPER_ADMIN, roles.ADMIN, roles.CANDIDATE, roles.ORG_ADMIN, roles.ORG_MANAGER, roles.ORG_USER];

module.exports = db;
