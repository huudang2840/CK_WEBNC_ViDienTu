const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetTokenScheme = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expire_at: { type: Date, default: Date.now(), expires: 600 },
});

module.exports = mongoose.model("resetTokens", resetTokenScheme);
