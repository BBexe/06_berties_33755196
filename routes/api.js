// API routes - provides JSON data for external applications
const express = require("express");
const router = express.Router();

// GET books as JSON with optional filters
// Query parameters:
//   - search: filter by book name (partial match)
//   - minprice: minimum price filter
//   - maxprice: maximum price filter
//   - sort: sort by 'name' or 'price'
router.get('/books', function (req, res, next) {

    // Start building the SQL query
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];

    // Task 3: Search filter - filter by book name
    if (req.query.search) {
        conditions.push("name LIKE ?");
        params.push('%' + req.query.search + '%');
    }

    // Task 4: Price range filters
    if (req.query.minprice) {
        conditions.push("price >= ?");
        params.push(parseFloat(req.query.minprice));
    }
    if (req.query.maxprice) {
        conditions.push("price <= ?");
        params.push(parseFloat(req.query.maxprice));
    }

    // Added WHERE clause if there are conditions
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // Task 5: Sort option
    if (req.query.sort) {
        if (req.query.sort === 'name') {
            sqlquery += " ORDER BY name ASC";
        } else if (req.query.sort === 'price') {
            sqlquery += " ORDER BY price ASC";
        }
    }

    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err);
            next(err);
        }
        else {
            res.json(result);
        }
    });
});

module.exports = router;
