const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletModel = new Schema({
  owner: { type: "string", unique: true.required },
  token: { type: String, required: true },
  update_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("wallets", WalletModel);
