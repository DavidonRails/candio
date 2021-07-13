module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define("jobs", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },

        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        companyId: {
            type: Sequelize.INTEGER,
        },

        title: {
            type: Sequelize.STRING,
        },

        department: {
            type: Sequelize.STRING,
        },

        industry: {
            type: Sequelize.STRING,
        },

        code: {
            type: Sequelize.STRING,
        },
        
        country: {
            type: Sequelize.STRING,
        },
        
        region: {
            type: Sequelize.STRING,
        },

        remote: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

        function: {
            type: Sequelize.STRING,
        },

        employmentType: {
            type: Sequelize.STRING,
        },

        experience: {
            type: Sequelize.STRING,
        },

        education: {
            type: Sequelize.STRING,
        },

        keyword: {
            type: Sequelize.STRING,
        },
        
        fromSalary: {
            type: Sequelize.STRING,
        },

        toSalary: {
            type: Sequelize.STRING,
        },

        currency: {
            type: Sequelize.STRING,
        },

        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0, // 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved, 5 : job deleted
            allowNull: false,
            comment: "0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved, 5 : job deleted"
        }

    });
  
    return Job;
  };
  