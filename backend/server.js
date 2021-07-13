if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const allowDomains = [
  "https://*.candio.dev",
  "https://api.candio.dev",
  "https://app.candio.dev",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:9000",
  "http://localhost:9002",
  "http://107.170.239.210:9000"
]

var bcrypt = require("bcryptjs");

var corsOptions = {
  origin: allowDomains
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// database
const db = require("./app/models");

// Migration
const userMigration = require("./app/migrate/user.migrate");
const companyMigration = require("./app/migrate/company.migrate");
const quizMigration = require("./app/migrate/quiz.migrate");
const quesMigration = require("./app/migrate/question.migrate");


db.sequelize.sync();

// force: true will drop the table if it already exists

// db.sequelize.sync({force: true}).then(() => {
//   console.log('------------------------- Drop and Resync Database with { force: true } -------------------------');
//   userMigration.initial();
//   companyMigration.initial();
//   quizMigration.initial();
//   quesMigration.initial();
//   console.log('------------------------- Migration Done! -------------------------');
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to candio application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/api.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
