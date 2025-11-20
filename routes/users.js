// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


// 1. REGISTRATION ROUTES


router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    if (!plainPassword) {
        return res.send("Error: Password field cannot be empty.");
    }

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Check if the error message contains the word 'email'
                    if (err.sqlMessage.includes('email')) {
                         return res.send("Error: That email address is already registered!");
                    } 
                    // Otherwise it must be the username
                    else {
                        return res.send("Error: That username is already taken!");
                    }
                }
                console.error("Database Error:", err);
                return next(err);    
            }
            
            res.send('Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We stored your password as: ' + hashedPassword);
        });
    });
});



// 2. LOGIN ROUTES with audit Logging


// Display the login form
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    // 1. Check if user exists
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) return next(err);
        
        // Case A: User Not Found
        if (result.length === 0) {
            // Log the failure
            let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
            db.query(auditQuery, [req.body.username, "Fail - User not found"], (err, result) => {
                if (err) console.error(err); // Log error but don't crash
            });
            
            return res.send("User not found. Please register first.");
        }

        let storedHash = result[0].hashedPassword;

        // 2. Compare Passwords
        bcrypt.compare(req.body.password, storedHash, function(err, match) {
            if (err) return next(err);
            
            if (match === true) {
                // Case B: Success
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, "Success"], (err, result) => {
                     if (err) console.error(err);
                });

                res.send("Success! You are logged in as: " + req.body.username);
            } else {
                // Case C: Wrong Password
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, "Fail - Wrong Password"], (err, result) => {
                     if (err) console.error(err);
                });

                res.send("Login failed. Wrong password.");
            }
        });
    });
});


// 3. USER LIST ROUTE andn AUDIT LOG ROUTE


router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM users"; 
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("user_list.ejs", {availableUsers: result});
    });
});

// New Route 
router.get('/audit', function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY attempt_time DESC"; 
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("audit.ejs", {auditData: result});
    });
});

// Export the router so index.js can use it
module.exports = router;