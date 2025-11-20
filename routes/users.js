// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    
    // DEBUG: Check what the server is actually receiving
    console.log("Full Form Data:", req.body);

    // SAFETY CHECK: If password is missing, stop here.
    if (!plainPassword) {
        return res.send("Error: The password field is empty. Check if your index.js has 'app.use(express.urlencoded({extended:true}))' and your form input is named 'password'.");
    }

    // Hashing the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // DEBUG: Check if the hash was created successfully
        console.log("2. Generated hash:", hashedPassword);

        let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
        
        // Ensure the variable here matches the one in function(err, hashedPassword) above
        let newrecord = [
            req.body.username, 
            req.body.first, 
            req.body.last, 
            req.body.email, 
            hashedPassword 
        ];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.error("Database Error:", err); // Log database errors specifically
                return next(err);
            }
            
            let message = 'Hello ' + req.body.first + ' ' + req.body.last + 
                          ' you are now registered! We will send an email to you at ' + req.body.email;
            message += ' (We stored your password as: ' + hashedPassword + ')';
            
            res.send(message);
        });
    });
}); 

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT username, firstname, lastname, email FROM users"; // query database to get all the users without passwords
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("user_list.ejs", {availableUsers: result});
    });
});

module.exports = router;