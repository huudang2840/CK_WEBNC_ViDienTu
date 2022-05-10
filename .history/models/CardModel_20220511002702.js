const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardModel = new Schema({
  number_card: { type: Number, default: 0, required: true },
  date: { type: Date, default: new Date() },
  CVV: { type: Array },
});

module.exports = mongoose.model("cards", CardModel);
