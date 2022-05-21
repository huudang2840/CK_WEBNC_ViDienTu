const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});

module.exports = router;
