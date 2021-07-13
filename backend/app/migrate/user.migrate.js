// database
const db = require("../models");
const roles = require("../config/role.config");

var bcrypt = require("bcryptjs");

const Userdb = db.user;
const Profiledb = db.profile;
const Companydb = db.company;
const Challengedb = db.challenge;

exports.initial = () => {

    Userdb.create({
      //id: 1,
      username: "wwang",
      email: "wwang@candio.com",
      password: bcrypt.hashSync("password", 8),
      phone: "15140105623",
      title: "web developer",
      headline: "Enthusiastic developer",
      department: "MEAN/MERN Stack",
      role: roles.CANDIDATE,
      skill: 'PHP,Node,Javascript',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/candio-24fb6.appspot.com/o/Resume%2Fbp5e3o8w4qqa4rtzaa95vf.jpg?alt=media&token=9b6c00cc-97e4-4972-b151-a1e3e645cf9b',

    }).then((user) => {

        Profiledb.create({
          userId: user.id,
          resume: "https://firebasestorage.googleapis.com/v0/b/candio-24fb6.appspot.com/o/Resume%2Fj9ww8erurndv0xpyw706jb.pdf?alt=media&token=03c348c5-8cbd-4f85-8b21-651858182a33",
          shared_name: "wwang",
          summary: "I am full stack web and mobile developer.",
          education_degree: "Master",
          education_university: "IT tech college",
          education_start_date: "2005-04-01T05:00:00.000Z",
          education_end_date: "2009-04-01T04:00:00.000Z",
        });

        Challengedb.create({
          user_id: user.id,
          quiz_id: 3,
          question_list: "6,9,32,4,32,37,26,31,18,38",
          score: 10,
          state: 2, // Assessment Completed
          progress: 10 // Total Question Count 
        });

        Challengedb.create({
          user_id: user.id,
          quiz_id: 5,
          question_list: "16,19,22,14,2,34,19,7,6,39",
          score: 9,
          state: 2, // Assessment Completed
          progress: 10 // Total Question Count 
        });
      
    });
  
    Userdb.create({
      //id: 2,
      username: "Janessa Comanda Baja",
      email: "ja.janessa@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "639564415906",
      title: "Frontend developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'JavaScript, TypeScript, PHP, React Native',
      photoURL: '',

    }).then((user) => {

        Profiledb.create({
          userId: user.id,
          resume: "",
          shared_name: "janessa",
          summary: "I am full stack web and mobile developer.",
          education_degree: "Master",
          education_university: "IT tech college",
          education_start_date: "2005-04-01T05:00:00.000Z",
          education_end_date: "2009-04-01T04:00:00.000Z",
        });

        Challengedb.create({
          user_id: user.id,
          quiz_id: 3,
          question_list: "16,19,22,14,2,34,19,7,6,39",
          score: 8,
          state: 2, // Assessment Completed
          progress: 10 // Total Question Count 
        });

        Challengedb.create({
          user_id: user.id,
          quiz_id: 5,
          question_list: "6,9,32,4,32,37,26,31,18,38",
          score: 9,
          state: 2, // Assessment Completed
          progress: 10 // Total Question Count 
        });

    });

    Userdb.create({
      //id: 3,
      username: "Steven T. Fisher",
      email: "sher@nevada.unr.edu",
      password: bcrypt.hashSync("password", 8),
      phone: "8017215361",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'C, C++, Java, Python, Go, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "Steven",
            summary: "I am full stack web developer.",
            education_degree: "Master",
            education_university: "IT tech college",
            education_start_date: "2005-04-01T05:00:00.000Z",
            education_end_date: "2009-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 3,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 8,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 4,
      username: "Jeremy Hull",
      email: "sourdrums@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "4048193744",
      title: "Mobile developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'swift, kotlin, xamarin, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "sourdrums",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "DeVry University",
            education_start_date: "2009-04-01T05:00:00.000Z",
            education_end_date: "2011-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 10,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });
     
    Userdb.create({
      //id: 5,
      username: "Vaibhav Singhal",
      email: "Vaibhav.Singhal@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "4807993440",
      title: "Mobile developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Python, Bash, Java, Prolog, SML, Scheme, C/C++, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "Vaibhav.Singhal",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "Online Examination Portal",
            education_start_date: "2009-04-01T05:00:00.000Z",
            education_end_date: "2011-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 2,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 9,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 6,
      username: "Tim Sherman",
      email: "tim.rs.sherman@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "602-535-6547",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Prolog, SML, Scheme, C/C++, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "tim.rs.sherman",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "University of Arizona",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 8,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 7,
      username: "Jacob Janas",
      email: "jakejanas@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "+1630-277-1085",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Prolog, SML, Scheme, C/C++, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "jakejanas",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "University of Arizona",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 2,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 9,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 8,
      username: "Muhammad Sami",
      email: "msami2@asu.edu",
      password: bcrypt.hashSync("password", 8),
      phone: "480-937-8158",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Prolog, SML, Scheme, C/C++, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "msami2",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "University of Arizona",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 9,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 9,
      username: "Chad Fingerson",
      email: "chadfingerson@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "623330-9467",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'JavaScript, Node.JS, Express.JS, HTML, CSS, SQLite, LaTex, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "chadfingerson",
            summary: "I am mobile developer.",
            education_degree: "Master",
            education_university: "University of Arizona",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 8,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });


    Userdb.create({
      //id: 10,
      username: "Shireen Abraham",
      email: "shireenabraham@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "6022991677",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Java, Python, Golang, JavaScript, AWS Lambda, REST, Jenkins, JIRA, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "shireenabraham",
            summary: "I am web developer.",
            education_degree: "Master",
            education_university: "College of Engineering, Guindy, Anna University",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 2,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 9,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 11,
      username: "James Yang",
      email: "jyangx85@gmail.com",
      password: bcrypt.hashSync("password", 8),
      phone: "415802-5499",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Java, Python, Golang, JavaScript, AWS Lambda, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "jyangx85",
            summary: "I am web developer.",
            education_degree: "Master",
            education_university: "Grantham University, Lenexa, Kansas",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 10,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    Userdb.create({
      //id: 12,
      username: "Darion Walls",
      email: "wallsdarion@yahoo.com",
      password: bcrypt.hashSync("password", 8),
      phone: "901832-5305",
      title: "Web developer",
      headline: "Senior Software Engineer",
      department: "Full stack",
      role: roles.CANDIDATE,
      skill: 'Groovy, Python, C++, Java, JavaScript, CSS, PHP, Django, HTML, Matlab, RESTAPI, Verilog, PowerPoint, Word, Excel, Bootstrap, Visual Studio, Web Development, Wix, Atom, SoapUI, React Native',
      photoURL: '',

    }).then((user) => {

          Profiledb.create({
            userId: user.id,
            resume: "",
            shared_name: "wallsdarion",
            summary: "I am web developer.",
            education_degree: "Master",
            education_university: "University of Memphis",
            education_start_date: "2017-04-01T05:00:00.000Z",
            education_end_date: "2018-04-01T04:00:00.000Z",
          });

          Challengedb.create({
            user_id: user.id,
            quiz_id: 5,
            question_list: "6,9,32,4,32,37,26,31,18,38",
            score: 8,
            state: 2, // Assessment Completed
            progress: 10 // Total Question Count 
          });

    });

    // Company Account

    Userdb.create({
      //id: udid,
      username: "EXQSD",
      email: "dev@exqsd.com",
      password: bcrypt.hashSync("password", 8),
      title: "EXQSD Company",
      headline: "Software development Co.LTD",
      department: "Web and Mobile",
      role: roles.ORG_ADMIN,
      company_id: 1
    });
  
    // Admin Account

    Userdb.create({
      //id: udid,
      username: "admin",
      email: "admin@candio.com",
      password: bcrypt.hashSync("password", 8),
      title: "Administrator",
      role: roles.ADMIN
    });
  
    // Super Admin Account

    Userdb.create({
      //id: udid,
      username: "superadmin",
      email: "superadmin@candio.com",
      password: bcrypt.hashSync("password", 8),
      title: "Super Administrator",
      role: roles.SUPER_ADMIN
    });

};

