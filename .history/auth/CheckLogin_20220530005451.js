const Account = require("../../models/Account");

module.exports = async function (req, res, next) {
  let username = req.session.username;
  if (!username) {
    return res.redirect("/user/login");
  }
  let User = await Account.findOne({ username: username }).exec();
  next();
};
