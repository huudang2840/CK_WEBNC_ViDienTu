const express = require("express");
const router = express.Router();
const checkLogin = require("../../auth/CheckLogin");

router.get("/", function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});

module.exports = router;
