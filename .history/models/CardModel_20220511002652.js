const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardModel = new Schema({
  number_card: { type: Number, default: 0, required },
  date: { type: Date, default: new Date() },
  history: { type: Array },
});

module.exports = mongoose.model("cards", CardModel);