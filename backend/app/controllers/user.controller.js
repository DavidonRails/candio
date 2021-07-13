const db = require("../models");
const UserModel = db.user;


exports.getById = (req, res) => {
  UserModel.findByPk(req.params.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    return res.status(200).send(user);
  });
};

exports.getAll = (req, res) => {
  UserModel.findAll().then((result) => {
    return res.status(200).send(result);
  });
};

exports.list = (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
      if (req.query.page) {
          req.query.page = parseInt(req.query.page);
          page = Number.isInteger(req.query.page) ? req.query.page : 0;
      }
  }
  UserModel.list(limit, page).then((result) => {
      res.status(200).send(result);
  })
};


exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId)
      .then((result)=>{
          res.status(204).send({});
      });
};