module.exports = (sequelize, Sequelize) => {
    const CandidateAnswer = sequelize.define("candidate_answers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      challenge_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      answer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isRight: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }

    });
  
    return CandidateAnswer;
};