module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("companys", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      postal: {
        type: Sequelize.STRING,
      },
      ein: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      }
    });
  
    return Company;
  };
  