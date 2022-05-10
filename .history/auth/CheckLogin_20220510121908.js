module.exports = function (req, res, next) {
  let username = req.session.username;
  if (!username) {
    return res.json({ code: 401, message: "chưa đăng nhập" });
  }
  next();
};
