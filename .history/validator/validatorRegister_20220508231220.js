const { check } = require("express-validator");

module.exports = [
  check("name")
    .exists()
    .withMessage("Vui điền lòng tên người dùng")
    .notEmpty()
    .withMessage("Không được để trống họ và tên")
    .isLength({ min: 4 })
    .withMessage("Chiều dài của họ tên ít nhất 4 kí tự"),

  check("email")
    .exists()
    .withMessage("Vui lòng nhập email")
    .notEmpty()
    .withMessage("Không được để trống email")
    .isEmail()
    .withMessage("Email không đúng định dạng"),

  check("phone")
    .exists()
    .withMessage("Vui lòng nhập số điện thoại")
    .notEmpty()
    .withMessage("Không được để trống số điện thoại")
    .isLength({ min: 10, max: 15 })
    .withMessage("Độ dài của số điện thoại không phù hợp"),

  check("birth")
    .exists()
    .withMessage("Vui lòng nhập ngày sinh")
    .notEmpty()
    .withMessage("Không được để trống ngày sinh"),
];
