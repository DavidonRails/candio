module.exports = (sequelize, Sequelize) => {
    const ProfileCompany = sequelize.define("profile_companys", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      profileId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }, 

      position: {
        type: Sequelize.STRING
      },

      company_name: {
        type: Sequelize.STRING,
      },

      start_date: {
        type: Sequelize.STRING,
        allowNull: true
      },

      end_date: {
        type: Sequelize.STRING,
        allowNull: true
      },
    });
  
    return ProfileCompany;
  };
  