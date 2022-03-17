var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

/**
 * APIs
 */

/**
 * GET list of experiences
 */
router.get("/list", function (req, res, next) {
  dbConn.query(
    "SELECT * FROM experience ORDER BY id desc",
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
  let ex_month = req.body.ex_month;
  let ex_year = req.body.ex_year;
  let ex_location = req.body.ex_location;
  let ex_job = req.body.ex_job;

  var form_data = {
    user_id: user_id,
    ex_month: ex_month,
    ex_year: ex_year,
    location: ex_location,
    job: ex_job,
  };

  // insert query
  dbConn.query(
    "INSERT INTO experience SET ?",
    form_data,
    function (err, result) {
      req.flash("success", "Experience successfully added");
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
    "SELECT * FROM experience WHERE id = " + id,
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
  let ex_month = req.body.ex_month;
  let ex_year = req.body.ex_year;
  let ex_location = req.body.ex_location;
  let ex_job = req.body.ex_job;
  var form_data = {};

  var form_data = {
    ex_month: ex_month,
    ex_year: ex_year,
    location: ex_location,
    job: ex_job,
  };

  // update query
  dbConn.query(
    "UPDATE experience SET ? WHERE id = " + id,
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
    "DELETE FROM experience WHERE id = " + id,
    function (err, result) {
      res.redirect("/");
    }
  );
});

module.exports = router;
