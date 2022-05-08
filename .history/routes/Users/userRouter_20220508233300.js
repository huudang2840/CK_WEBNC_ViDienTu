var express = require("express");
var router = express.Router();
const { validationResult } = require("express-validator");
const mailer = require("../../sendMail");
const bcrypt = require("bcrypt");
const Account = require("../../models/Account");
const ResetToken = require("../../models/ResetTokenModel");
const validatorRegister = require("../../validator/validatorRegister");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cmnd");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.email + "-" + file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([
  { name: "front_IDcard", maxCount: 10 },
  { name: "back_IDcard", maxCount: 10 },
]);

router.get("/", function (req, res, next) {
  res.json({ message: "Account Router" });
});

router.get("/login", function (req, res, next) {
  let type = req.flash("type");
  let error = req.flash("message");

  res.render("login", { type: type, error: error });
});

router.post("/login", function (req, res, next) {
  let { username, password } = req.body;
  let acc = undefined;
  Account.findOne({ username: username })
    .then((account) => {
      if (!account) {
        throw new Error("Tài khoản chưa được đăng ký");
      }
      acc = account;
      return bcrypt.compare(password, account.password);
    })
    .then((passwordMatch) => {
      if (!passwordMatch) {
        req.flash("type", "success");
        req.flash("message", "Mật khẩu không đúng");
        return res.redirect("/user/login");
      }
      const { JWT_SECRET } = process.env;
      jwt.sign(
        {
          username: acc.username,
        },
        JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.redirect("/index");
          // return res.json({
          //   code: 0,
          //   message: "Đăng nhập thành công",
          //   token: token,
          // });
        }
      );
    })
    .catch((err) => {
      req.flash("type", "danger");
      req.flash("message", err.message);
      return res.redirect("/user/login");
    });
});

// Đăng ký
router.get("/register", (req, res) => {
  let type = req.flash("type");
  let error = req.flash("message");
  res.render("register", { type: type, error: error });
});

// POST Đăng ký
router.post("/register", validatorRegister, uploadMultiple, async (req, res) => {
  let result = validationResult(req);

  let { phone, name, email, address, birth } = req.body;

  let { back_IDcard, front_IDcard } = req.files;

  var userPhone = await Account.findOne({ phone: phone });
  var userEmail = await Account.findOne({ email: email });

  // Email hoặc số điện thoại đã được đăng ký
  if (userPhone || userEmail) {
    req.flash("type", "danger");
    req.flash("message", "Số điện thoại hoặc email đã được đăng ký");
    res.redirect("/user/register");
  } else {
    // if (result.errors.length === 0) {
    let password = crypto.randomBytes(3).toString("hex");
    let username = randomUsername();
    let passwordHashed = (await bcrypt.hash(password, 10)).toString();
    let user = new Account({
      phone: phone,
      name: name,
      email: email,
      address: address,
      birth: birth,
      front_IDcard: front_IDcard[0].path,
      back_IDcard: back_IDcard[0].path,
      username: username,
      password: passwordHashed,
    });
    user.save().then(() => {
      mailer.sendInfo(email, username, password);
      req.flash("type", "success");
      req.flash("message", "Đăng ký thành công");
      return res.redirect("/user/login");
    });
    // } else {
    //   let messages = result.mapped();
    //   let message = "";

    //   for (m in messages) {
    //     message = messages[m].msg;
    //     break;
    //   }

    //   req.flash("type", "success");
    //   req.flash("message", message);
    //   res.redirect("/user/register");
    // }
  }
});

// Quên mật khẩu
router.get("/forgot", (req, res) => {
  let type = req.flash("type");
  let error = req.flash("message");
  res.render("forgot-password", { error: error, type: type });
});

router.post("/forgot", async (req, res) => {
  let email = req.body.email;
  let token = crypto.randomBytes(32).toString("hex");

  //Kiểm tra email có tồn tại trong database không
  var checkEmail = await Account.findOne({ email: email });
  if (checkEmail) {
    //Trường hợp email có trong hệ thống thì sẽ gửi yêu cầu cấp link reset mk cùng với token qua mail
    // và lưu vào database, link này có hạn là 10p kể từ lúc gửi đi
    await ResetToken({ token: token, email: email })
      .save()
      .then(() => {
        req.flash("message", "Gửi yêu cầu thành công vui lòng kiểm tra email");
        req.flash("type", "success");
        mailer.sendResetMail(email, token);
        res.redirect("/user/forgot");
      })
      .catch((err) => {
        req.flash("message", err.message);
        req.flash("type", "danger");
        res.redirect("/user/forgot");
      });
  } else {
    //Trường hợp email không tồn tại trong database
    req.flash("message", "Email không tồn tại");
    req.flash("type", "danger");
    res.redirect("/user/forgot");
  }
});

router.get("/reset/:token", async (req, res) => {
  let token = req.params.token;
  let check = await ResetToken.findOne({ token: token });
  if (!check) {
    res.send("Token không hợp lệ hoặc đã hết hạn");
  } else {
    let type = req.flash("type");
    let error = req.flash("message");
    res.render("resetpassword", { type, error });
  }
});

router.post("/reset/:token", async (req, res) => {
  let token = req.params.token;
  let { pass, confirm_pass } = req.body;
  let email = "";
  if (pass !== confirm_pass) {
    req.flash("type", "danger");
    req.flash("message", "Mật khẩu không trùng khớp");
    return res.redirect("/user/reset/" + token);
  }
  ResetToken.findOne({ token: token }, (err, user) => {
    if (!err) {
      email = user.email;
    } else {
      console.log(err);
    }
  });
  let passwordHashed = (await bcrypt.hash(pass, 10)).toString();

  await Account.findOneAndUpdate({ email: email }, { $set: { password: passwordHashed } });
  await ResetToken.findOneAndDelete({ token: token });
  return res.redirect("/user/login");
});

function randomUsername() {
  let str = "";
  for (let i = 0; i <= 5; i++) {
    str += Math.floor(Math.random() * 10).toString();
  }
  return str;
}

module.exports = router;
