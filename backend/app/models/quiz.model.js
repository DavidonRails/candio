module.exports = (sequelize, Sequelize) => {
    const Quiz = sequelize.define("quizzes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      assessment: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      category: {
        type: Sequelize.STRING,
      },
      ques_counts: {
        type: Sequelize.INTEGER,
      }
  
    });
  
    return Quiz;
  };
  