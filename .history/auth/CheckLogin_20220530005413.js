const Account = require("../../models/Account");

module.exports = function (req, res, next) {
  let username = req.session.username;
  if (!username) {
    return res.redirect("/user/login");
  }
  let User = Account;
  next();
};
