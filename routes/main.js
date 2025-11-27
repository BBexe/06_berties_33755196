// Create a new router
const express = require("express")
const router = express.Router()

// Home page
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

// About page
router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/login',function(req, res, next){
    res.render('login.ejs')
});

router.get('/register',function(req, res, next){
    res.render('register.ejs')
});

router.get('/contact',function(req, res, next){
    res.render('contact.ejs')
});



// Export the router object so index.js can access it
module.exports = router