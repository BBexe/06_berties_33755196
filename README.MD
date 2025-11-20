# Bertie's Books

Small example Node/Express application for managing and viewing a small book collection. The app uses Express + EJS templates and a MySQL database. This README explains how to install, configure and run the project locally.

**Status:** Minimal example / teaching lab. Not production hardened.

**Tech:** Node.js, Express, EJS, MySQL


```sh
npm install
node index.js
```

---

**Prerequisites**

- Node.js (v14+ recommended)
- MySQL server (local or remote)
- A MySQL user with permission to create/use the database

---

**Install dependencies**

```sh
npm install
```

**Run the app**

```sh
node index.js
# then open http://localhost:8000
```

---

**Available Routes**

- `GET /` — Home page (renders `views/index.ejs`).
- `GET /about` — About page (`views/about.ejs`).
- `GET /books/list` — Show all books (renders `views/list.ejs`, loads from DB).
- `GET /books/bargainbooks` — List books priced under £20 (renders `views/results.ejs`).
- `GET /books/search` — Search form (renders `views/search.ejs`).
- `GET /books/search-result?keyword=...` — Search results (renders `views/results.ejs`) supporting exact and partial matches.
- `GET /users/register` — User registration form (`views/register.ejs`).
- `POST /users/registered` — Accept registration form and create user (passwords hashed with `bcrypt`).
- `GET /users/login` — Login form (`views/login.ejs`).
- `POST /users/loggedin` — Authenticate user; logs success/failure to `login_audit` and returns success message (session management not implemented).
- `GET /users/audit` — View audit log (renders `views/audit.ejs`) showing recent login attempts.

---

**Project structure**

- `index.js` — Application entry point; Express setup, environment variable loader (`dotenv`), DB pool and route mounting.
- `package.json` — Project metadata and Node dependencies.
- `create_db.sql` — SQL script to create the `books`, `users` and `login_audit` tables (run this to initialize the database).
- `insert_test_data.sql` — Optional sample data for books/users.
- `routes/` — Route handlers:
	- `main.js` — Home and static pages.
	- `books.js` — Book-related routes (`/books/list`, `/books/search`, `/books/bargainbooks`, `/books/search-result`).
	- `users.js` — User registration, login and audit routes (`/users/register`, `/users/registered`, `/users/login`, `/users/loggedin`, `/users/audit`).
- `views/` — EJS templates used by the app:
	- `index.ejs`, `about.ejs` — Basic pages.
	- `list.ejs` — Simple list view used for listing all books.
	- `search.ejs` — Search form.
	- `results.ejs` — Nicely formatted search/bargain results table.
	- `register.ejs`, `login.ejs` — Forms for user registration and login.
	- `audit.ejs` — Audit log display.
- `public/` — Static assets (CSS in `main.css`, client JS if present).

Files you might want to add (suggested): `.env.example` (sample environment variables), `.gitignore` (to ignore `.env`).

---

**Dependencies & Technologies**

- Node.js (recommended v14+)
- Express — Web framework
- EJS — Templating engine for server-rendered views
- MySQL / `mysql2` — Database driver
- `bcrypt` — Password hashing
- `dotenv` — Environment variable loader for configuration and secrets
- Optional: `nodemon` for development auto-reload

Install dependencies with:

```sh
npm install
# or to install a specific list:
npm install express ejs mysql2 bcrypt dotenv
```


---

**Authentication, Environment Security & Audit Logging**

Week 7

Features Implemented

- **User Registration:** Users can register with a username, email, name, and password.
- **Passwords are securely hashed** using `bcrypt` before storage.
- Includes error handling for duplicate usernames or emails.
- **User Login:** Secure login system verifying hashed passwords against the database.
- **Database Security:** Database credentials are secured using environment variables (`dotenv`).
- **Audit Logging:** Tracks all successful and failed login attempts for security monitoring.

Installation & Setup

Install Dependencies:

```sh
npm install express ejs mysql2 bcrypt dotenv
```

Database Setup:

Ensure the `users` and `login_audit` tables are created in your MySQL database (see `create_db.sql`).

Environment Variables:

Create a `.env` file in the root directory (see "dotenv Implementation" below).

Run the App:

```sh
node index.js
```

dotenv Implementation (Task 5)

To secure the database credentials, install the `dotenv` node module. This prevents sensitive passwords from being hardcoded in the source code and visible in version control.

Implementation Steps:

1. Create a `.env` file in the root directory to store the `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` variables.
2. Add `require('dotenv').config();` at the very top of `index.js`.
3. Update the database connection configuration in `index.js` to use `process.env.DB_HOST`, `process.env.DB_USER`, etc., instead of plain text strings.

Audit Logging (Task 6)

I implemented a mechanism to store successful and failed logins to monitor account activity.

Implementation Steps:

- **Database:** Created a `login_audit` table with columns for `username`, `action` (describing the event), and `attempt_time`.
- **Backend Logic:** Updated the `/users/loggedin` route in `routes/users.js` to write audit records:
	- If a user is not found, log: `Fail - User not found`.
	- If the password is incorrect, log: `Fail - Wrong Password`.
	- If the login is successful, log: `Success`.
- **Visualization:** Added a route `/users/audit` that queries the audit table and renders the full history using `views/audit.ejs`.
.

---




