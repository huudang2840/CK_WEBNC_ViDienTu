const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Wallet = require("../../models/WalletModel");
const checkLogin = require("../../auth/CheckLogin");

router.get("/", checkLogin, async function (req, res, next) {
  let username = req.session.username;
  let wallet;
  await Account.findOne({ owner: username }, (err, o) => {
    if (!err) {
      user = u;
    } else {
      console.log(err);
    }
  }).clone();
  console.log(user);

  res.render("home-wallet", { title: "Wallet" });
});

router.get("/", checkLogin, function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});

module.exports = router;