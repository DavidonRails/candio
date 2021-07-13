const db = require("../models");

const config = require("../config/auth.config");
const role = require("../config/role.config");

const Userdb = db.user;
const Companydb = db.company;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  

  if (!req.body.username) {
    return res.status(401).send({ message: "Username is empty." });
  }
  
  if (!req.body.email) {
    return res.status(401).send({ message: "Email is empty." });
  }

  var params = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    title: req.body.title,
    headline: req.body.headline,
    department: req.body.department,
    role:  req.body.role ? req.body.role: role.CANDIDATE, // 1 : SUPER_ADMIN, 2 : ADMIN, 3 : CANDIDATE, 4 : ORG_ADMIN, 5 : ORG_MANAGER, 6 : ORG_USER
    skill: req.body.skill,
    
    uid: req.body.uid, // Firebase User ID
    photoURL: req.body.photoURL,
    // emailVerified: user.emailVerified, // true or false
    // isAnonymous : user.isAnonymous, // true or false
    provider : req.body.provider,  // google.com, linkedin.com, etc
  }

  if (!req.body.provider) {
    if(!req.body.password) return res.status(401).send({ message: "Password is empty." });

    params['password'] = bcrypt.hashSync(req.body.password, 8);
  }

  // Company Account
  if (req.body.company) {
    var com = req.body.company;
    
    Companydb.create({
      name: com.name,
      street: com.street,
      city: com.city,
      state: com.state,
      postal: com.postal,
      ein: com.ein,
      description: com.description
    })
    .then(company => {
      params.company_id = company.id
      Userdb.create(params)
      .then(user => {
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        user = user.toJSON();
        user.accessToken = token;
    
        return res.status(200).send(user);    
      });
    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  } else {
    // Candidate Account

    Userdb.create(params)
    .then(user => {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
  
      user = user.toJSON();
      user.accessToken = token;
    
      return res.status(200).send(user);    

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  }
};


exports.signin = (req, res) => {

  if (!req.body.provider) {
      Userdb.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Password Incorrect!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        user = user.toJSON();
        user.accessToken = token;
  
        return res.status(200).send(user);
  
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
      
  } else {
    Userdb.findOne({
      where: {
        uid: req.body.uid
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Sorry, We can not find your account in Candio system. Please try to register." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      user = user.toJSON();
      user.accessToken = token;

      return res.status(200).send(user);

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  }

};
