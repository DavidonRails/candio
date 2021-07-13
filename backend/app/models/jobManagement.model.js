module.exports = (sequelize, Sequelize) => {
    const JobManagement = sequelize.define("job_management", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },

        jobId: {
            type: Sequelize.UUID,
            allowNull: false
        },

        candidateId: {
            type: Sequelize.UUID,
            allowNull: false
        },

        application: {
            type: Sequelize.INTEGER,
            defaultValue: 0, // 0: active candidate, 1 : invited candidate, 2 : applied candidate, 3 : approved candidate, 4 : rejected candidate
            allowNull: false,
            comment: "0: active candidate, 1 : invited candidate, 2 : applied candidate, 3 : approved candidate, 4 : rejected candidate"
        },
      
        stage: {
            type: Sequelize.INTEGER,
            defaultValue: 0, // 0: Sourcing open, 1 : Contacted, 2 : Written test, 3 : Technical interview, 4 : Culture fit round
            allowNull: false,
            comment: "0: Sourcing open, 1 : Contacted, 2 : Written test, 3 : Technical interview, 4 : Culture fit round"

        },

        fitRating: {
            type: Sequelize.STRING,
            defaultValue: 0.0,
        },

        applicationScore: {
            type: Sequelize.FLOAT,
            defaultValue: 0.0,
        },

    });
  
    return JobManagement;
};
  