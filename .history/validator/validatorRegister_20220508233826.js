var expressValidator = require("express-validator");
app.use(expressValidator());

module.exports = function (req, res, next) {
  req
    .checkBody("name")
    .exists()
    .withMessage("Vui điền lòng tên người dùng")
    .notEmpty()
    .withMessage("Không được để trống họ và tên")
    .isLength({ min: 4 })
    .withMessage("Chiều dài của họ tên ít nhất 4 kí tự"),
    req
      .checkBody("email")
      .exists()
      .withMessage("Vui lòng nhập email")
      .notEmpty()
      .withMessage("Không được để trống email")
      .isEmail()
      .withMessage("Email không đúng định dạng"),
    req
      .checkBody("phone")
      .exists()
      .withMessage("Vui lòng nhập số điện thoại")
      .notEmpty()
      .withMessage("Không được để trống số điện thoại")
      .isLength({ min: 10, max: 15 })
      .withMessage("Độ dài của số điện thoại không phù hợp"),
    req
      .checkBody("birth")
      .exists()
      .withMessage("Vui lòng nhập ngày sinh")
      .notEmpty()
      .withMessage("Không được để trống ngày sinh"),
    req
      .asyncValidationErrors()
      .then(function () {
        next();
      })
      .catch(function (errors) {
        req.flash("errors", errors);
        res.status(500).redirect("/user/register");
      });
};
