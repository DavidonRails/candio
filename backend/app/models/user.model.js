module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING, // If uid exist, password is null, If uid is null, password can not be null  
    },
    uid: {
      type: Sequelize.STRING, // Firebase User ID
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    headline: {
      type: Sequelize.STRING,
    },
    department: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.INTEGER // 1 : SUPER_ADMIN, 2 : ADMIN, 3 : CANDIDATE, 4 : ORG_ADMIN, 5 : ORG_MANAGER, 6 : ORG_USER
    },
    company_id: {
      type: Sequelize.INTEGER,
    },
    skill: {
      type: Sequelize.TEXT,
    },
    photoURL: {
      type: Sequelize.TEXT,
    },
    provider: {
      type: Sequelize.STRING,  // Google.com, Linkedin.com, etc
    },
    completed: {
      type: Sequelize.BOOLEAN, // Whether user extended profile is filled
      allowNull: false,
      defaultValue: false
    }


  });

  return User;
};
