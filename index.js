// Import express and ejs
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');

// Load environment variables from .env file (Task 5)
require('dotenv').config();

// ==================================================================
// DEBUGGING: Check if .env is loaded correctly
// ==================================================================
console.log("--- Checking Environment Variables ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER); // If this is undefined, your .env file is not found
console.log("DB_NAME:", process.env.DB_NAME);
console.log("--------------------------------------");

if (!process.env.DB_USER) {
    console.error("CRITICAL ERROR: DB_USER is missing! Make sure you have a file named '.env' in the root folder.");
}
// ==================================================================


// Define the database connection pool using environment variables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Make the database connection available globally
global.db = db;

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser to read form data
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')));

// Define our application-specific data
app.locals.shopData = {shopName: "Bertie's Books"};

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Load the route handlers for /books
const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// Start the web app listening
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});