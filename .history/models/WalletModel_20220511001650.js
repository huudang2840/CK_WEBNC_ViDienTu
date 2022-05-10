const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletModel = new Schema({
  owner: { type: String, unique: true, required: true },
  account_Balance: { type: String },
  update_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("wallets", WalletModel);
