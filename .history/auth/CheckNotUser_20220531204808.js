//Không cho phép admin vào các trang khác
module.exports = async function (req, res, next) {
  let username = req.session.username;

  if (username == "admin") {
    return res.redirect("/admin");
  }

  next();
};