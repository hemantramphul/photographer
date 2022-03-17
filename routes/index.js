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
  res.render("index", {
    username: req.session.username,
    userid: req.session.userid,
    loggin: req.session.loggedin,
  });
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
  let user_id = req.session.userid;
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

/**
 * GET record to edit
 */
router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(
    "SELECT * FROM photos WHERE id = " + id,
    function (err, rows, fields) {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/**
 * POST update record
 */
router.post("/update/:id", upload.single("image"), function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let location = req.body.location;
  let description = req.body.description;
  let image = req.file;
  var form_data = {};

  if (image) {
    form_data = {
      title: title,
      location: location,
      description: description,
      image: image.filename,
    };
  } else {
    form_data = {
      title: title,
      location: location,
      description: description,
    };
  }

  // update query
  dbConn.query(
    "UPDATE photos SET ? WHERE id = " + id,
    form_data,
    function (err, result) {
      res.redirect("/");
    }
  );
});

/**
 * GET delete record
 */
router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("DELETE FROM photos WHERE id = " + id, function (err, result) {
    res.redirect("/");
  });
});

module.exports = router;
