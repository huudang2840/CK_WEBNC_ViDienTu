const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardModel = new Schema({
  number_card: { type: Number, default: 0 }
  account_Balance: { type: Number, default: 0 },
  history: { type: Array },
});

module.exports = mongoose.model("cards", CardModel);
