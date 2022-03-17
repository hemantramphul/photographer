var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

/**
 * APIs
 */

/**
 * GET list of photos
 */
router.get("/list", function (req, res, next) {
  dbConn.query(
    "SELECT * FROM education ORDER BY id desc",
    function (err, rows) {
      if (err) {
        res.render({ data: err });
      } else {
        res.json(rows);
      }
    }
  );
});

/**
 * POST add photos via popup
 */
// add a new book
router.post("/add", function (req, res, next) {
  let user_id = 1; //req.session.userid;
  let edu_startyear = req.body.edu_startyear;
  let edu_endyear = req.body.edu_endyear;
  let edu_location = req.body.edu_location;
  let edu_field = req.body.edu_field;

  var form_data = {
    user_id: user_id,
    year_start: edu_startyear,
    year_ended: edu_endyear,
    location: edu_location,
    field: edu_field,
  };

  // insert query
  dbConn.query(
    "INSERT INTO education SET ?",
    form_data,
    function (err, result) {
      req.flash("success", "Edcucation successfully added");
      res.redirect("/");
    }
  );
});

/**
 * GET record to edit
 */
router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(
    "SELECT * FROM education WHERE id = " + id,
    function (err, rows, fields) {
      if (err) throw err;
      res.json(rows);
    }
  );
});

/**
 * POST update record
 */
router.post("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let edu_startyear = req.body.edu_startyear;
  let edu_endyear = req.body.edu_endyear;
  let edu_location = req.body.edu_location;
  let edu_field = req.body.edu_field;
  var form_data = {};

  var form_data = {
    year_start: edu_startyear,
    year_ended: edu_endyear,
    location: edu_location,
    field: edu_field,
  };

  // update query
  dbConn.query(
    "UPDATE education SET ? WHERE id = " + id,
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

  dbConn.query(
    "DELETE FROM education WHERE id = " + id,
    function (err, result) {
      res.redirect("/");
    }
  );
});

module.exports = router;
