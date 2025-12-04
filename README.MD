# Bertie's Books

A Node.js/Express web application for managing and viewing a book collection. Uses EJS templates and a MySQL database.

---

**Tech:** Node.js, Express, EJS, MySQL


```sh
npm install
node index.js
```

---

## Prerequisites

- Node.js (v14+)
- MySQL server
- A MySQL user with database permissions

---

## Routes Overview

**Public Routes:**
- `GET /` — Home page
- `GET /about` — About page
- `GET /books/search` — Search form
- `GET /books/search-result` — Search results
- `GET /users/register` — Registration form
- `GET /users/login` — Login form

**Protected Routes (Login Required):**
- `GET /books/list` — Full book list
- `GET /books/bargainbooks` — Bargain books
- `GET /users/logout` — Log out
- `GET /users/list` — User list
- `GET /users/audit` — Login audit log

---

## Dependencies

- Express, EJS, mysql2, bcrypt, dotenv
- express-session (session management)
- express-validator (input validation)
- express-sanitizer (XSS protection)

---

# Week 8: Session Management, Validation & Sanitization

---

## Part A: Session Management (Authorisation)

### What Was Implemented

Installed `express-session` to manage user sessions and control access to protected routes.

### How It Works

1. When a user logs in successfully, their username is saved to the session.
2. A middleware function `redirectLogin` checks if the user is logged in before allowing access to protected routes.
3. If not logged in, the user is redirected to the login page.
4. A logout route destroys the session when the user logs out.

### The Session Secret

The `secret` parameter in the session configuration is used to sign the session ID cookie. This prevents tampering — if someone modifies the cookie, the signature will not match and the session will be rejected.

### Access Control Decisions

| Route | Protected? | Reason |
|-------|------------|--------|
| Home, About, Search | No | Public information for all visitors |
| Book List, Bargain Books | Yes | Member-only content |
| Register, Login | No | Users need access to create accounts and log in |
| Logout, User List, Audit | Yes | Only authenticated users should access these |

---

## Part B: Input Validation

### What Was Implemented

Installed `express-validator` to validate user input on the registration form.

### Validation Rules

| Field | Rule | Purpose |
|-------|------|---------|
| Email | Must be valid email format | Ensure correct contact information |
| Username | 5-20 characters, alphanumeric and underscores only | Prevent invalid or unsafe usernames |
| Password | Minimum 5 characters | Basic password security |
| First Name | Required, letters only | Prevent invalid names |
| Last Name | Required | Ensure complete registration |

### How It Works

If validation fails, the user is returned to the registration page with error messages. The form repopulates with their previous input so they do not have to start over.

---

## Part C: Input Sanitization (XSS Protection)

### The Vulnerability

Before sanitization, entering `<script>alert("Gotcha!")</script>` in a form field would cause the script to execute in the browser. This is a Cross-Site Scripting (XSS) attack.

### How It Happened

User input was directly concatenated into the HTML response without any cleaning. The browser interpreted the script tags as executable code.

### The Solution

Installed `express-sanitizer` which strips HTML tags and dangerous characters from user input before processing.

### Sanitization Decisions

| Field | Sanitized? | Reason |
|-------|------------|--------|
| First Name, Last Name | Yes | Displayed back to users |
| Username | Yes | Shown in user lists and admin panels |
| Email | Yes | May be displayed in interfaces |
| Password | No | Hashed before storage, never displayed. Sanitizing could break intentional special characters |
| Search Keyword | Yes | Reflected in search results page |

---

## Part D: Deployment Compliance

### Test User
Username: `gold`
Password: `smiths`

### Environment Variables
```
DB_HOST='localhost'
DB_USER='berties_books_app'
DB_PASSWORD='qwertyuiop'
DB_NAME='berties_books'
```

---

## Previous Week: Authentication & Security

- Passwords are hashed with bcrypt before storage
- Database credentials stored in environment variables using dotenv
- All login attempts logged to audit table for security monitoring

---

# Week 9: APIs and Weather Integration

---

## Part A: Weather Forecast Feature

### What Was Implemented

Added a weather forecast page that fetches real-time weather data from the OpenWeatherMap API.

### New Routes

| Route | Description |
|-------|-------------|
| `GET /weather` | Weather search form |
| `GET /weather/result?city=London` | Weather results for a city |

### Features

- Search form to enter any city name
- Displays temperature, feels like, humidity, wind speed, pressure, and visibility
- Shows weather icon from OpenWeatherMap
- Styled weather card with gradient background
- Error handling for invalid cities and API errors

### Dependencies Added

- `request` module for making HTTP API calls

### Environment Variable

Added my OpenWeatherMap API key to `.env`:
```

---

## Part B: Books API

### What Was Implemented

Created a RESTful API endpoint that returns book data in JSON format for external applications.

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/books` | Returns all books as JSON |

### Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `search` | `?search=world` | Filter books by name (partial match) |
| `minprice` | `?minprice=5` | Filter books with price >= value |
| `maxprice` | `?maxprice=10` | Filter books with price <= value |
| `sort` | `?sort=name` or `?sort=price` | Sort results by name or price |

### Example API Calls

```
GET /api/books                              — All books
GET /api/books?search=universe              — Books containing "universe"
GET /api/books?minprice=5&maxprice=10       — Books priced £5-£10
GET /api/books?sort=price                   — All books sorted by price
GET /api/books?search=the&sort=name         — Combined filters
```


### Difference: API vs Web Route

| Feature | `/books/list` (Web) | `/api/books` (API) |
|---------|---------------------|-------------------|
| Response | HTML page | JSON data |
| Purpose | For users | For applications |
| Output | Rendered template | Raw data array |

---