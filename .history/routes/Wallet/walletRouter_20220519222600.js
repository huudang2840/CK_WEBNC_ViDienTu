const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Wallet = require("../../models/WalletModel");
const checkLogin = require("../../auth/CheckLogin");

router.get("/", checkLogin, function (req, res, next) {
  let username = req.session.username;
  let wallet;
  let user;
  Wallet.find({ owner: username }, (err, w) => {
    if (!err) {
      wallet = w;
    } else {
      console.log(err);
    }
  }).clone();
  Account.findOne({ username: username }, (err, u) => {
    if (!err) {
      user = u;
    } else {
      console.log(err);
    }
  }).clone();
  console.log(wallet);
  console.log(user);
  res.render("home-wallet", { wallet: wallet, user: user, title: "Wallet" });
});

router.get("/", checkLogin, function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});

module.exports = router;
