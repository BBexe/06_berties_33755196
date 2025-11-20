const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'smiths';

bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    if (err) return console.error(err);

    console.log(`INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES ('gold', 'Goldie', 'Smith', 'gold@berties.com', '${hashedPassword}');`);
});