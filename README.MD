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

- `GET /` — home page (renders `views/index.ejs`)
- `GET /about` — about page (`views/about.ejs`)
- `GET /books/list` — list all books (renders `views/list.ejs`, pulls from DB)
- `GET /books/search` — search form (`views/search.ejs`)
- `GET /books/search-result?keyword=...` — returns a simple text response with the search term (DB search not implemented)
- `GET /users/register` — registration form (`views/register.ejs`)
- `POST /users/registered` — accepts registration form and returns a confirmation message (no DB persistence in current code)

---

**Project structure**

- `index.js` — application entry point; Express setup and route mounting
- `package.json` — Node dependencies
- `create_db.sql` — SQL used to create tables/schema
- `insert_test_data.sql` — sample data (if present)
- `routes/` — route handlers (`main.js`, `books.js`, `users.js`)
- `views/` — EJS templates (`index.ejs`, `about.ejs`, `list.ejs`, `register.ejs`, `search.ejs`)
- `public/` — static assets (CSS, client JS)

---

**Next improvements**

- Add proper error handling and user-friendly error pages.
- Implement real search logic and parameterized queries to avoid SQL injection.
- Add unit/integration tests and a `start`/`dev` script in `package.json`.
- Use a configuration layer (environment variables / `.env`) for secrets.

---




