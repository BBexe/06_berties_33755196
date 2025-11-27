// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    // search the database for books matching the keyword
    // Get the search term from the query string
    let keyword = (req.query.keyword || req.query.search_text || '').trim();
    keyword = req.sanitize(keyword); // Sanitize the search term 

    // If they didn't type anything, just show an empty list
    if (!keyword || keyword.length === 0) {
        // no keyword provided — render an empty list
        return res.render('book_list.ejs', { availableBooks: []  })
    }

    // Advanced search: partial match using LIKE.
    // The % signs mean "anything can be before or after this text"
    const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    const pattern = `%${keyword}%`;

    db.query(sqlquery, [pattern], (err, result) => {
        if (err) {
            return next(err)
        }
        // render a nicer results view with title and results
        res.render('results.ejs', { availableBooks: result, title: `Search results for "${keyword}"` })
    })
});

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("book_list.ejs", {availableBooks:result})
        });
});

router.get('/bargainbooks', redirectLogin, function(req, res, next) {
    // list names and prices for books priced less than 20
    const sqlquery = "SELECT name, price FROM books WHERE price < ?";
    db.query(sqlquery, [20], (err, result) => {
        if (err) {
            return next(err)
        }
        // render a nicer results view for bargain books
        res.render('results.ejs', { availableBooks: result, title: 'Bargain books under £20' })
    })
});


// Export the router object so index.js can access it
module.exports = router

