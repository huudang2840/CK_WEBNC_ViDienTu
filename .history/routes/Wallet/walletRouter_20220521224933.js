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
  let { number_card, CVV, add_money } = req.body;
  let username = req.session.username;
  let wallet = await currentWallet(username);
  let card = await Card.findOne({ number_card: number_card, CVV: CVV }).exec();
  if ((card && card.max_charge === undefined) || (card && card.max_charge >= add_money)) {
    if (card.card_balance < add_money || card.card_balance === 0) {
      return res.json({ message: "Số dư không đủ" });
    }
    let balance_after = Number(wallet.account_balance) + Number(add_money);
    let wallet_history = wallet.history;
    let history = makeHistory(
      "recharge",
      number_card,
      wallet.owner,
      add_money,
      0,
      balance_after,
      "Nap tien"
    );
    wallet_history.push(history);
    await Wallet.findOneAndUpdate(
      { owner: username },
      { account_balance: Number(balance_after), history: wallet_history }
    );
    await Card.findOneAndUpdate(
      { number_card: number_card, CVV: CVV },
      { card_balance: Number(card.card_balance - add_money) }
    );
    return res.json({ message: "OK" });
  } else if (card && card.max_charge < add_money) {
    return res.json({ message: "Vượt quá hạn mức" });
  } else {
    return res.json({ message: "No card" });
  }
});

// Rút tiền
router.get("/withdraw", checkLogin, function (req, res, next) {
  res.render("wallet-withdraw", { title: "Wallet" });
});

router.post("/withdraw", checkLogin, async function (req, res, next) {
  let { number_card, CVV, date, sub_money, notes } = req.body;
  date = new Date(date);
  let username = req.session.username;
  let wallet = await currentWallet(username);
  let card = await Card.findOne({ number_card: number_card, CVV: CVV, date: date }).exec();
  console.log(new Date(date), sub_money);
  console.log(card);
  return res.json({ message: "OK" });

  // if ((card && card.max_charge === undefined) || (card && card.max_charge >= add_money)) {
  //   if (card.card_balance < add_money || card.card_balance === 0) {
  //     return res.json({ message: "Số dư không đủ" });
  //   }
  //   let balance_after = Number(wallet.account_balance) + Number(add_money);
  //   let wallet_history = wallet.history;
  //   let history = makeHistory(
  //     "recharge",
  //     number_card,
  //     wallet.owner,
  //     add_money,
  //     0,
  //     balance_after,
  //     "Nap tien"
  //   );
  //   wallet_history.push(history);
  //   await Wallet.findOneAndUpdate(
  //     { owner: username },
  //     { account_balance: Number(balance_after), history: wallet_history }
  //   );
  //   await Card.findOneAndUpdate(
  //     { number_card: number_card, CVV: CVV },
  //     { card_balance: Number(card.card_balance - add_money) }
  //   );
  //   return res.json({ message: "OK" });
  // } else if (card && card.max_charge < add_money) {
  //   return res.json({ message: "Vượt quá hạn mức" });
  // } else {
  //   return res.json({ message: "No card" });
  // }
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
function makeHistory(type, from, to, add_money, sub_money, wallet_balance, contents) {
  return {
    type: type,
    from: from,
    to: to,
    add_money: add_money,
    sub_money: sub_money,
    wallet_balance: wallet_balance,
    contents: contents,
    create_at: Date.now(),
  };
}

module.exports = router;
