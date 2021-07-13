const db = require("../models");
const CompanyModel = db.company;


exports.getAll = (req, res) => {
    CompanyModel.findAll().then((result) => {
    return res.status(200).send(result);
  });
};