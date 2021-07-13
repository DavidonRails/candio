// database
const db = require("../models");
const roles = require("../config/role.config");

const Userdb = db.user;
const Companydb = db.company;

exports.initial = () => {

    Companydb.create({
        id: 1,
        name: "EXQSD",
    });

    Companydb.create({
        id: 2,
        name: "Microsoft",
    });

    Companydb.create({
        id: 3,
        name: "Apple",
    });
};

