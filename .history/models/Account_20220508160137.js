const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema({
  phone: { type: "string", unique: true },
  email: { type: "string", unique: true },
  name: { type: "string" },
  birthday: { type: "date" },
  address: { type: "string" },
  front_IDcard: { type: "string" },
  back_IDcard: { type: "string" },
  username: { type: "string" },
  password: { type: "string" },
  firstLogin: { type: "boolean", default: true },
  verifyAccount: { type: "boolean", default: false },
});

module.exports = mongoose.model("Account", Account);
