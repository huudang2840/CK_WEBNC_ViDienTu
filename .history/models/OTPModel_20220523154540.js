const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: { type: String, required: true },
  OTP: { type: String, required: true },
  expire_at: { type: Date, default: Date.now(), expires: 600 },
});

module.exports = mongoose.model("OTP", OTPSchema);
