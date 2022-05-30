const Account = require("../models/Account");

module.exports = async function (req, res, next) {
  let username = req.session.username;
  if (!username) {
    return res.redirect("/user/login");
  }
  let user = await Account.findOne({ username: username }).exec();
  console.log(user.firstLogin);
  if (user.firstLogin) {
    return res.redirect("/user/firstlogin");
  }
  next();
};
