module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("questions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    },
    { 
        timestamps:false, 
    });
  
    return Question;
};
  