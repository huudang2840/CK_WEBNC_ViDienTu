const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardModel = new Schema({
  owner: { type: String, unique: true, required: true },
  account_Balance: { type: Number, default: 0 },
  history: { type: Array },
});

module.exports = mongoose.model("wallets", CardModel);
