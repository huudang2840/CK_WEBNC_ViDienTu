var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("home-wallet", { title: "Wallet" });
});

module.exports = router;
