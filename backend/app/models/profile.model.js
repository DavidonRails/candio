module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profiles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      resume: {
        type: Sequelize.STRING,
      },

      shared_name: {
        type: Sequelize.STRING,
      },

      summary: {
        type: Sequelize.TEXT,
      },

      education_degree: {
        type: Sequelize.STRING,
      },

      education_university: {
        type: Sequelize.STRING
      },

      education_start_date: {
        type: Sequelize.STRING,
      },
      
      education_end_date: {
        type: Sequelize.STRING,
      }
    });
  
    return Profile;
  };
  