const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhonCardSchema = new Schema({
  email: { type: String, required: true },
  OTP: { type: String, required: true },
  expire_at: { type: Date, default: new Date(), expires: 600 },
});

module.exports = mongoose.model("PhoneCard", PhonCardSchema);
