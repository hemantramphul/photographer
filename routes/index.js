var express = require("express");
const multer = require("multer");
const path = require("path");
var router = express.Router();
var dbConn = require("../lib/db");

/**
 * Storage of files: Use of Multer
 */
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./assets/img/"); // directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
});

/**
 * APIs
 */

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/**
 * GET list of photos
 */
router.get("/list", function (req, res, next) {
  dbConn.query("SELECT * FROM photos ORDER BY id desc", function (err, rows) {
    if (err) {
      res.render({ data: err });
    } else {
      res.json(rows);
    }
  });
});

/**
 * POST add photos via popup
 */
// add a new book
router.post("/add", upload.single("image"), function (req, res, next) {
  let user_id = 1; //req.body.user_id;
  let title = req.body.title;
  let location = req.body.location;
  let description = req.body.description;
  let image = req.file;

  var form_data = {
    user_id: user_id,
    title: title,
    location: location,
    description: description,
    image: image.filename,
  };

  // insert query
  dbConn.query("INSERT INTO photos SET ?", form_data, function (err, result) {
    req.flash("success", "Photos successfully added");
    res.redirect("/");
  });
});

module.exports = router;
