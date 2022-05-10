const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardModel = new Schema({
  number_card: { type: Number, default: 0, required: true },
  date: { type: Date, default: new Date() },
  CVV: { type: Number },
  card_balance: { type: Number, default: 0 },
  max_charge: { type: Number, default: 0 },
  max_number_charge: { type: Number, default: 0 },
  message: { type: String },
});

module.exports = mongoose.model("cards", CardModel);
