const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Wallet = require("../../models/WalletModel");
const checkLogin = require("../../auth/CheckLogin");

router.get("/", checkLogin, async function (req, res, next) {
  let username = req.session.username;
  let user = currentUser(username);
  let wallet;
  await Wallet.findOne({ owner: username }, (err, w) => {
    if (!err) {
      wallet = w;
    } else {
      console.log(err);
    }
  }).clone();

  let value;
  try {
    value = await user;
    console.log(value);
  } catch (err) {
    console.log(err);
  }
  console.log(value);
  res.render("home-wallet", { wallet: wallet, user: value, title: "Wallet" });
});

// Nạp tiền
router.get("/recharge", checkLogin, function (req, res, next) {
  res.render("wallet-recharge", { title: "Wallet" });
});

router.post("/recharge", checkLogin, function (req, res, next) {
  res.json({ message: "Ok" });
});

async function currentUser(username) {
  let user;
  await Account.findOne({ username: username }, (err, u) => {
    if (!err) {
      user = u;
    } else {
      console.log(err);
    }
  }).clone();

  return await user;
}

module.exports = router;
