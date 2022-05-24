const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Card = require("../../models/CardModel");
const Wallet = require("../../models/WalletModel");
const checkLogin = require("../../auth/CheckLogin");

router.get("/", checkLogin, async function (req, res, next) {
  let username = req.session.username;
  let user = findUser(username);
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
  let wallet = await findWallet(username);
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
      0,
      balance_after,
      "Nap tien",
      "done"
    );
    wallet_history.push(history);
    await Wallet.findOneAndUpdate(
      { owner: username },
      { account_balance: Number(balance_after), history: wallet_history }
    );
    await Card.findOneAndUpdate(
      { number_card: number_card, CVV: CVV },
      { card_balance: Number(card.card_balance) - Number(add_money) }
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
  let username = req.session.username;
  let wallet = await findWallet(username);
  let card = await Card.findOne({ number_card: number_card, CVV: CVV, date: date }).exec();

  if (sub_money % 50000 !== 0) {
    return res.json({ message: "Só tiền rút phải là bội số của 50,0000VND" });
  }

  let history = await Wallet.find();
  console.log(history);
  if (!card) {
    // return res.json({ message: "OK" });
    return res.json({ message: "Thông tin thẻ không hợp lệ!!" });
  } else {
    if (wallet.account_balance < sub_money) {
      return res.json({ message: "Số dư ví không đủ" });
    } else {
      let wallet_history = wallet.history;
      let fee = (sub_money * 5) / 100;
      let balance_after = Number(wallet.account_balance) - Number(sub_money) - Number(fee);

      if (sub_money >= 5000000) {
        wallet_history.push(
          makeHistory(
            "withdraw",
            number_card,
            wallet.owner,
            0,
            sub_money,
            fee,
            wallet.account_balance,
            notes,
            "waiting"
          )
        );
        await Wallet.findOneAndUpdate({ owner: username }, { history: wallet_history });
        return res.json({ message: "Waiting" });
      }
      wallet_history.push(
        makeHistory(
          "withdraw",
          number_card,
          wallet.owner,
          0,
          sub_money,
          fee,
          balance_after,
          notes,
          "done"
        )
      );
      await Wallet.findOneAndUpdate(
        { owner: username },
        { account_balance: Number(balance_after), history: wallet_history }
      );
      await Card.findOneAndUpdate(
        { number_card: number_card, CVV: CVV, date: date },
        { card_balance: Number(card.card_balance) + Number(sub_money) }
      );
      return res.json({ message: "OK" });
    }
  }
});

// Chuyển tiền
router.get("/transfer", checkLogin, function (req, res, next) {
  res.render("wallet-transfer", { title: "Wallet" });
});

router.post("/transfer", checkLogin, async function (req, res, next) {
  let { phone, money_transfer, notes } = req.body;
  console.log(phone, money_transfer, notes);
  let userReceive = await findUserWithPhone(phone);
  let walletReceive = await findWallet(userReceive.username);
  console.log(walletReceive);
  res.json({ code: "OK" });
});

async function findUser(username) {
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

async function findUserWithPhone(phone) {
  let user;
  await Account.findOne({ phone: phone }, (err, u) => {
    if (!err) {
      user = u;
    } else {
      console.log(err);
    }
  }).clone();

  return await user;
}

async function findWallet(owner) {
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
function makeHistory(type, from, to, add_money, sub_money, fee, wallet_balance, contents, status) {
  return {
    type: type,
    from: from,
    to: to,
    add_money: add_money,
    sub_money: sub_money,
    fee: fee,
    wallet_balance: wallet_balance,
    contents: contents,
    status: status,
    create_at: Date.now(),
  };
}

module.exports = router;
