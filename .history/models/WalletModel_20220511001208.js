const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletModel = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expire_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("wallets", WalletModel);
