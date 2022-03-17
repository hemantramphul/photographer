var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

/**
 * POST authenticate user
 */
router.post("/authentication", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  dbConn.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (err, rows, fields) {
      if (err) throw err;

      // if user not found
      if (rows.length <= 0) {
        res.json({
          error: true,
          message: "Please correct enter email and Password!",
        });
      } else {
        // if user found
        req.session.loggedin = true;
        req.session.username = rows[0].username;
        req.session.userid = rows[0].id;
        res.json({
          error: false,
          message: "Login successfully !",
          username: rows[0].username,
          userid: rows[0].id,
        });
      }
    }
  );
});

/**
 * GET logout user
 */
// Logout user
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
