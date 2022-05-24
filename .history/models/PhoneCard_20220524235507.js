const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhonCardSchema = new Schema({
  number_head: { type: String },
  seri: { type: String },
  value: { type: Number },
});

module.exports = mongoose.model("PhoneCard", PhonCardSchema);
