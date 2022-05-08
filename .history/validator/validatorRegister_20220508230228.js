const { check } = require("express-validator");

module.exports = [
  check("name")
    .exists()
    .withMessage("Vui lòng tên người dùng")
    .notEmpty()
    .withMessage("Không được để trống họ và tên"),

  check("email")
    .exists()
    .withMessage("Vui lòng nhập email")
    .notEmpty()
    .withMessage("Không được để trống email")
    .isEmail()
    .withMessage("Email không đúng định dạng"),

  check("password")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu")
    .notEmpty()
    .withMessage("Không được để trống mật khẩu"),
];
