const Account = require("../models/Account");
// Kiểm tra đã đăng nhập chưa, nếu chưa sẽ chuyển về trang đăng nhập
module.exports = async function (req, res, next) {
  let username = req.session.username;

  console.log("user" + username);
  if (!username) {
    return res.redirect("/user/login");
  }

  next();
};
