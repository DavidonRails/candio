module.exports = (sequelize, Sequelize) => {
    const ProfileProject = sequelize.define("profile_projects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      profileCompanyId: {
        type: Sequelize.INTEGER,
      },

      project_name: {
        type: Sequelize.TEXT,
      },

      summary: {
        type: Sequelize.TEXT,
      },

      outcome: {
        type: Sequelize.TEXT,
      },

      url: {
        type: Sequelize.STRING
      },

      skills: {
        type: Sequelize.TEXT,
      },
      
      images: {
        type: Sequelize.TEXT,
      }
    });
  
    return ProfileProject;
  };
  