// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


// 1. REGISTRATION ROUTES


// Display the registration form
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

// Handle the registration form submission
router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    // Safety check: prevent crashing if password is empty
    if (!plainPassword) {
        return res.send("Error: Password field cannot be empty.");
    }

    // Hash the password before saving
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // Save user to database
        // Note: Using 'firstname' and 'lastname' to match your database table
        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
        
        let newrecord = [
            req.body.username, 
            req.body.first, 
            req.body.last, 
            req.body.email, 
            hashedPassword
        ];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return next(err);
            }
            
            let message = 'Hello ' + req.body.first + ' ' + req.body.last + 
                          ' you are now registered! We stored your password as: ' + hashedPassword;
            res.send(message);
        });
    });
});



// 2. LOGIN ROUTES


// Display the login form
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

// Handle the login form submission
router.post('/loggedin', function (req, res, next) {
    // Check if the user exists in the database
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) {
            return next(err);
        }
        
        // If result is empty, user doesn't exist
        if (result.length === 0) {
            return res.send("User not found. Please register first.");
        }

        // Get the hash from the DB
        let storedHash = result[0].hashedPassword;

        // Compare the form password with the DB hash
        bcrypt.compare(req.body.password, storedHash, function(err, result) {
            if (err) {
                return next(err);
            }
            
            if (result === true) {
                res.send("Success! You are logged in as: " + req.body.username);
            } else {
                res.send("Login failed. Wrong password.");
            }
        });
    });
});


// 3. USER LIST ROUTE


router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM users"; 

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("user_list.ejs", {availableUsers: result});
    });
});

// Export the router so index.js can use it
module.exports = router;