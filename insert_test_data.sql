# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES ('gold', 'Goldie', 'Smith', 'gold@berties.com', '$2b$10$gqlHaN1ouZ3oGHx9rUFUDOye.Wfowmb6YrFwZZC9mK2ojm4UnK1we');