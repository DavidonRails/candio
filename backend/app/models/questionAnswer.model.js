module.exports = (sequelize, Sequelize) => {
    const QuestionAnswer = sequelize.define("question_answers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isCorrect: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
      }
    });
  
    return QuestionAnswer;
};
