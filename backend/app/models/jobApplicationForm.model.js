
module.exports = (sequelize, Sequelize) => {
    const JobApplicationForm = sequelize.define("job_application_forms", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },

        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },

        companyId: {
            type: Sequelize.INTEGER,
        },

        jobId: {
            type: Sequelize.UUID,
        },

        name: {
            type: Sequelize.STRING,
            defaultValue: 'mandatory', // mandatory, optional, off
        },

        email: {
            type: Sequelize.STRING,
            defaultValue: 'mandatory', // mandatory, optional, off
        },

        headline: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        phone: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        address: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        photo: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        education: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        experience: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        summary: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        resume: {
            type: Sequelize.STRING,
            defaultValue: 'optional', // mandatory, optional, off
        },

        coverletter: {
            type: Sequelize.STRING,
            defaultValue: 'mandatory', // mandatory, optional, off
        },
    });
  
    return JobApplicationForm;
  };
  


