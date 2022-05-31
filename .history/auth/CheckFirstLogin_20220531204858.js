const Account = require("../models/Account");
// Lần đầu đăng nhập không được vào các trang khác
module.exports = async function (req, res, next) {
  let username = req.session.username;

  let user = await Account.findOne({ username: username }).exec();
  console.log(user.firstLogin);
  if (user.firstLogin == true) {
    return res.redirect("/user/firstlogin");
  }
  next();
};
