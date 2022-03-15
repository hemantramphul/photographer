var express = require("express");
var router = express.Router();

/**
 * APIs
 */

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/test", function (req, res, next) {
  res.send("index");
});

module.exports = router;
