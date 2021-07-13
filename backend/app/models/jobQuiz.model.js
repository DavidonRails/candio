module.exports = (sequelize, Sequelize) => {
    const JobQuiz = sequelize.define("job_quizs", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },

        jobId: {
            type: Sequelize.UUID,
        },

        quiz: {
            type: Sequelize.STRING,
        },

        type: {
            type: Sequelize.STRING,
        },
        /* Quiz Type (Our System save only value)
            { label: 'Paragraph', value: 'free-text', options: false },
            { label: 'Short answer', value: 'short_text', options: false },
            { label: 'Yes/No', value: 'boolean', options: false },
            { label: 'Dropdown', value: 'dropdown', options: true },
            { label: 'Multiple choice', value: 'multiple_choice', options: true },
            { label: 'Date', value: 'date', options: false },
            { label: 'Number', value: 'numeric', options: false },
            { label: 'File upload', value: 'file', options: false }
        */

        answers: {
            type: Sequelize.TEXT,
        },
    },
    { 
        timestamps:false, 
    });
  
    return JobQuiz;
};
  