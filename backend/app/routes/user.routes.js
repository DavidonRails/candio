const { authJwt } = require("../middleware");
const UsersController = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/:userId",
    [authJwt.verifyToken],
    UsersController.getById
  );

  app.get(
    "/api/users",
    [authJwt.verifyToken],
    UsersController.getAll
  );

};
