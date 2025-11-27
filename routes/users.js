const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') 
    } else { 
        next (); 
    } 
}

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
        if (err) return next(err);

        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('email')) {
                         return res.send("Error: That email address is already registered!");
                    } else {
                        return res.send("Error: That username is already taken!");
                    }
                }
                return next(err);    
            }
            res.send('Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We stored your password as: ' + hashedPassword);
        });
    });
});

// 2. LOGIN ROUTES
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) return next(err);
        
        // CASE: User Not Found
        if (result.length === 0) {
            // Render the result page with failure message
            return res.render('login_result.ejs', { 
                success: false, 
                message: "User not found. Please register first." 
            });
        }

        let storedHash = result[0].hashedPassword;

        bcrypt.compare(req.body.password, storedHash, function(err, match) {
            if (err) return next(err);
            
            if (match === true) {
                // CASE: Success
                req.session.userId = req.body.username; 
                
                // Render the result page with success message
                res.render('login_result.ejs', { 
                    success: true, 
                    username: req.body.username 
                });

                // Audit Log (Background task)
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, "Success"], (err) => { if(err) console.error(err); });

            } else {
                // CASE: Wrong Password
                res.render('login_result.ejs', { 
                    success: false, 
                    message: "Incorrect password." 
                });

                // Audit Log (Background task)
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                db.query(auditQuery, [req.body.username, "Fail - Wrong Password"], (err) => { if(err) console.error(err); });
            }
        });
    });
});

// 3. LOGOUT ROUTE
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        res.send('you are now logged out. <a href=' + '/' + '>Home</a>');
    })
})

// 4. LIST & AUDIT
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