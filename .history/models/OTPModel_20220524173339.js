const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: { type: String, required: true },
  OTP: { type: String, required: true },
  expire_at: { type: Date, default: new Date(), expires: 60 },
});

module.exports = mongoose.model("OTP", OTPSchema);