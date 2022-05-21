const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Card = require("../../models/CardModel");
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
  } catch (err) {
    console.log(err);
  }
  res.render("home-wallet", { wallet: wallet, user: value, title: "Wallet" });
});

// Nạp tiền
router.get("/recharge", checkLogin, function (req, res, next) {
  res.render("wallet-recharge", { title: "Wallet" });
});

router.post("/recharge", checkLogin, async function (req, res, next) {
  let { number_card, CVV, number_money } = req.body;
  let card;

  await Card.findOne({ number_card: number_card, CVV: CVV }, async (err, c) => {
    if (!err) {
      card = await c;
    } else {
      console.log(err);
    }
  }).clone();
  let wallet = await currentWallet(req.session.username);

  console.log(wallet);

  console.log(card);
  if (card) {
    return res.json({ message: "OK" });
  } else {
    return res.json({ message: "No card" });
  }
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

async function currentWallet(owner) {
  let wallet;
  await Wallet.findOne({ owner: owner }, (err, w) => {
    if (!err) {
      wallet = w;
    } else {
      console.log(err);
    }
  }).clone();

  return wallet;
}

async function findCard(owner) {
  let wallet;
  await Wallet.findOne({ owner: owner }, (err, w) => {
    if (!err) {
      wallet = w;
    } else {
      console.log(err);
    }
  }).clone();

  return wallet;
}

module.exports = router;
