// Nếu không phải admin thì không vào được trang addmin
module.exports = async function (req, res, next) {
  let username = req.session.username;
  if (username != "admin") {
    return res.redirect("/wallet");
  }
  next();
};
