const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Wallet = require("../../models/WalletModel");
const checkLogin = require("../../auth/CheckLogin");

router.get("/", checkLogin, async function (req, res, next) {
  let username = req.session.username;
  let wallet;
  let user;
  await Wallet.find({ owner: username }, (err, w) => {
    if (!err) {
      wallet = w;
    } else {
      console.log(err);
    }
  }).clone();
  Account.find({ username: username }, (err, u) => {
    if (!err) {
      user = u;
    } else {
      console.log(err);
    }
  });
  console.log(wallet);
  console.log(user);
  res.render("home-wallet", { wallet: wallet, user: user, title: "Wallet" });
});

router.get("/", checkLogin, function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});


async function (req, res, next)

module.exports = router;
