const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletModel = new Schema({
  owner: { type: String, unique: true, required: true },
  account_balance: { type: Number, default: 0 },
  history: [
    {
      type: { type: String },
      from: { type: String },
      to: { type: String },
      add_money: { type: Number, default: 0 },
      sub_money: { type: Number, default: 0 },
      wallet_balance: { type: Number },
      contents: { type: String },
      status: { type: String, default: "Done" },
      create_at: { type: Date, default: Date.now() },
    },
  ],
  create_at: { type: Date, default: Date.now() },
  update_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("wallets", WalletModel);