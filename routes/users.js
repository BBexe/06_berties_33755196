const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Cost factor for hashing - higher means safer but slower
// Import express-validator
const { check, validationResult } = require('express-validator');

// Middleware to check if the user is logged in
// If they aren't, send them to the login page
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') 
    } else { 
        next (); // User is logged in, proceed to the next handler
    } 
}

// REGISTRATION ROUTES
router.get('/register', function (req, res, next) {
    // Render the register page initially with no errors and empty input data
    res.render('register.ejs', { errors: [], inputData: {} });
});

// Route with Validation 
router.post('/registered', [
    // Validate email
    check('email').isEmail().withMessage('Please enter a valid email address'),
    
    // Validate username length (min 5, max 20)
    check('username').isLength({ min: 5, max: 20 }).withMessage('Username must be between 5 and 20 characters'),
    check('username').matches(/^[A-Za-z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    // Validate password length (min 8)
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 8 characters long'),

    // Validate First Name (Not empty) and sanitize to prevent XSS
    check('first').notEmpty().withMessage('First name is required'),
    check('first').isAlpha().withMessage('First name can only contain letters'),

    // Validate Last Name (Not empty) and sanitize to prevent XSS
    check('last').notEmpty().withMessage('Last name is required')
], function (req, res, next) {

    // 3. Check for validation errors
    const errors = validationResult(req);

    // If we found any errors in the validation chain above...
    if (!errors.isEmpty()) {
        // If errors, re-render the register page, passing the errors and the user's input
        // errors.array() converts the errors into an array of objects
        return res.render('register.ejs', { 
            errors: errors.array(), 
            inputData: req.body 
        });
    }

    // No validation errors — proceed with registration
    const plainPassword = req.body.password;

    // Sanitize user input to prevent XSS (Task 6 & 7)
    req.body.first = req.sanitize(req.body.first);
    req.body.last = req.sanitize(req.body.last);
    req.body.username = req.sanitize(req.body.username);
    req.body.email = req.sanitize(req.body.email);

    // Hash the password before storing it
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    //hashing and database insertion logic
        if (err) return next(err);

        // Prepare the SQL to save the new user
        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                // Handle duplicate entry error (e.g., duplicate username or email)
                // You can pass a custom error object to the template
                if (err.code === 'ER_DUP_ENTRY') {
                     let errorMsg = "";
                     if (err.sqlMessage.includes('email')) {
                         errorMsg = 'That email address is already registered!';
                     } else {
                        errorMsg = 'That username is already taken!';
                     }
                     
            
                     let dbErrors = [];
                     if (err.sqlMessage.includes('email')) {
                         dbErrors.push({ path: 'email', msg: 'That email address is already registered!' });
                     } else {
                         dbErrors.push({ path: 'username', msg: 'That username is already taken!' });
                     }

                     return res.render('register.ejs', { 
                        errors: dbErrors, 
                        inputData: req.body 
                    });
                }
                return next(err);    
            }
            res.send('Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We stored your password as: ' + hashedPassword);
        });
    });
});

// LOGIN ROUTES
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {
    // Sanitize username 
    req.body.username = req.sanitize(req.body.username);

    // First, find the user by their username
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) return next(err);
        
        if (result.length === 0) {
            return res.render('login_result.ejs', { success: false, message: "User not found." });
        }

        let storedHash = result[0].hashedPassword;

        // Compare the password they just typed with the one in the DB
        bcrypt.compare(req.body.password, storedHash, function(err, match) {
            if (err) return next(err);
            
            // If the passwords match, log them in!
            if (match === true) {
                req.session.userId = req.body.username; // Save user to session
                res.render('login_result.ejs', { success: true, username: req.body.username });
            } else {
                res.render('login_result.ejs', { success: false, message: "Incorrect password." });
            }
        });
    });
});

// LOGOUT
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./');
        res.send('you are now logged out. <a href=' + './' + '>Home</a>');
    })
})

// LIST & AUDIT
router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM users"; 
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("user_list.ejs", {availableUsers: result});
    });
});

router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY attempt_time DESC"; 
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("audit.ejs", {auditData: result});
    });
});

module.exports = router;