const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Card = require("../../models/CardModel");
const Wallet = require("../../models/WalletModel");
const Otp = require("../../models/OTPModel");
const mailer = require("../../sendMail");

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
  let userReceive = await Account.findOne({ phone: phone }).exec();
  let walletUserCurrent = await Wallet.findOne({ owner: req.session.username }).exec();

  let fee = (Number(money_transfer) * 5) / 100;

  if (!userReceive) {
    return res.json({ message: "Thông tin người nhận không tồn tại" });
  } else if (walletUserCurrent.account_balance < money_transfer) {
    return res.json({ message: "Số dư không đủ" });
  } else {
    // let walletReceive = await Wallet.findOne({ owner: userReceive.username }).exec();

    return res.render("wallet-transfer-cofirm", { userReceive, money_transfer, notes, fee });
  }
});

// Xác thực OTP
router.post("/transfer-OTP", checkLogin, async function (req, res, next) {
  let { money_transfer, phone, notes, fee, person_pay, otp } = req.body;
  console.log(money_transfer, phone, notes, fee, person_pay, otp);
  let userCurrent = await Account.findOne({ username: req.session.username }).exec();
  let walletCurrent = await Wallet.findOne({ owner: userCurrent.username }).exec();

  let userReceive = await Account.findOne({ phone: phone }).exec();
  let walletReceive = await Wallet.findOne({ owner: userReceive.username }).exec();

  let balance_after_current;
  let balance_after_receive;

  let wallet_history_current = walletCurrent.history;
  let wallet_history_receive = walletReceive.history;
  let getOTP = await Otp.findOne({ email: userCurrent.email }).exec();

  if (!getOTP) {
    return res.json({ message: "Mã OTP đã hết hạn" });
  } else if (Number(getOTP.OTP) === Number(otp)) {
    if (money_transfer < 5000000) {
      if (person_pay === "me") {
        // Cập nhật ví của người chuyển
        balance_after_current =
          Number(walletCurrent.account_balance) - Number(fee) - Number(money_transfer);
        wallet_history_current.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            0,
            Number(fee) + Number(money_transfer),
            fee,
            balance_after_current,
            notes,
            "done"
          )
        );

        await Wallet.findOneAndUpdate(
          { owner: userCurrent.username },
          { account_balance: Number(balance_after_current), history: wallet_history_current }
        );

        // Cập nhật ví của người nhận
        balance_after_receive = Number(walletReceive.account_balance) + Number(money_transfer);
        wallet_history_receive.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            Number(money_transfer),
            0,
            0,
            balance_after_receive,
            notes,
            "done"
          )
        );
        await Wallet.findOneAndUpdate(
          { owner: userReceive.username },
          { account_balance: Number(balance_after_receive), history: wallet_history_receive }
        );
        return res.json({ message: "send OTP" });
      } else if (person_pay === "userReceive") {
        balance_after_current = Number(walletCurrent.account_balance) - Number(money_transfer);
        wallet_history_current.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            0,
            Number(money_transfer),
            0,
            balance_after_current,
            notes,
            "done"
          )
        );

        await Wallet.findOneAndUpdate(
          { owner: userCurrent.username },
          { account_balance: Number(balance_after_current), history: wallet_history_current }
        );

        // Cập nhật ví của người nhận
        balance_after_receive =
          Number(walletReceive.account_balance) + Number(money_transfer) - Number(fee);
        wallet_history_receive.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            Number(money_transfer),
            0,
            fee,
            balance_after_receive,
            notes,
            "done"
          )
        );
        await Wallet.findOneAndUpdate(
          { owner: userReceive.username },
          { account_balance: Number(balance_after_receive), history: wallet_history_receive }
        );
        return res.json({ message: "ORther fee" });
      } else {
        return res.json({ message: "Lỗi giao dịch" });
      }
    } else {
      if (person_pay === "me") {
        // Cập nhật ví của người chuyển
        balance_after_current =
          Number(walletCurrent.account_balance) - Number(fee) - Number(money_transfer);
        wallet_history_current.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            0,
            Number(fee) + Number(money_transfer),
            fee,
            balance_after_current,
            notes,
            "waiting"
          )
        );

        await Wallet.findOneAndUpdate(
          { owner: userCurrent.username },
          { history: wallet_history_current }
        );

        return res.json({ message: "Chhuyeen tien thanh cong" });
      } else if (person_pay === "userReceive") {
        balance_after_current = Number(walletCurrent.account_balance) - Number(money_transfer);
        wallet_history_current.push(
          makeHistory(
            "transfer",
            userCurrent.username,
            userReceive.username,
            0,
            Number(money_transfer),
            0,
            balance_after_current,
            notes,
            "waiting"
          )
        );

        await Wallet.findOneAndUpdate(
          { owner: userCurrent.username },
          { history: wallet_history_current }
        );

        return res.json({ message: "Chuyen tien thanh cong" });
      } else {
        return res.json({ message: "Lỗi giao dịch" });
      }
    }
  } else {
    return res.json({ message: "Sai mã OTP!! Giao thực thất bại" });
  }
});

router.post("/transfer-confirm", checkLogin, async function (req, res, next) {
  let { money_transfer, phone, notes, fee, person_pay } = req.body;
  let userCurrent = await Account.findOne({ username: req.session.username }).exec();

  if (
    person_pay === "me" &&
    Number(money_transfer) + Number(fee) > Number(userCurrent.account_balance)
  ) {
    return res.json({ message: "Số dư không đủ" });
  } else if (Number(money_transfer) > Number(userCurrent.account_balance)) {
    return res.json({ message: "Số dư không đủ" });
  } else {
    let getOTP = randomOTP();
    let otp = new Otp({
      email: userCurrent.email,
      OTP: getOTP,
    });
    otp.save();
    mailer.sendOTP(userCurrent.email, getOTP);

    return res.render("wallet-transfer-OTP", { money_transfer, phone, notes, fee, person_pay });
  }
});
// Chuyển tiền

// Mua thẻ cào
router.get("/phonecard", checkLogin, function (req, res, next) {
  res.render("wallet-phonecard", { title: "Wallet" });
});

router.post("/phonecard", checkLogin, async function (req, res, next) {
  let { code_card, money_card, number_card } = req.body;
  let walletCurrent = await Wallet.findOne({ owner: req.session.username }).exec();
  let walletHistory = walletCurrent.history;
  let nameCard;

  switch (code_card) {
    case "11111":
      nameCard = "Viettel";
      break;
    case "22222":
      nameCard = "Mobifone";
      break;
    case "33333":
      nameCard = "Vinafone";
      break;
    default:
      return res.json({ message: "Thẻ k hợp lệ" });
  }

  let seriCard = [];
  for (let i = 0; i < Number(number_card); i++) {
    seriCard.push(String(code_card) + String(randomPhoneCard()));
  }
  let totalBill = Number(money_card) * Number(number_card);
  if (totalBill > walletCurrent.account_balance) {
    return res.json({ message: "Số dư k đủ" });
  }
  walletHistory.push({
    type: "phonecard",
    sub_money: totalBill,
    fee: 0,
    wallet_balance: Number(walletCurrent.account_balance) - Number(totalBill),
    phone_card: {
      name: nameCard,
      seri: seriCard,
      money: money_card,
    },

    status: { type: String, default: "done" },
    create_at: { type: Date, default: Date.now() },
  });
  await Wallet.findOneAndUpdate(
    { owner: req.session.username },
    {
      account_balance: Number(walletCurrent.account_balance) - Number(totalBill),
      history: walletHistory,
    }
  );
  console.log(nameCard, seriCard, totalBill);
  res.json({ message: "Ok" });
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
function randomOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

function randomPhoneCard() {
  return Math.floor(Math.random() * 90000) + 10000;
}

module.exports = router;
