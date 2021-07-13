module.exports = (sequelize, Sequelize) => {
    const Challenge = sequelize.define("challenges", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_list: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.INTEGER // 0: challenge created, 1 : Pledge agree, challenge started,  2 : challenge completed, 3 : challenge abstention
      },
      progress: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });
  
    return Challenge;
  };
  