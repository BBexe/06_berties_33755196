const fs = require('fs');
const path = require('path');

// 1. Define the correct path for the .env file
const envPath = path.join(__dirname, '.env');

// 2. Define the exact content required
const envContent = `DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_NAME=berties_books`;

// 3. Write the file
try {
    // Write the file ensuring UTF-8 encoding and no hidden characters
    fs.writeFileSync(envPath, envContent.trim(), { encoding: 'utf8' });
    
    console.log("=================================================");
    console.log("✅ SUCCESS: .env file has been fixed!");
    console.log("   Location: " + envPath);
    console.log("   Content wrote: \n" + envContent);
    console.log("=================================================");
    console.log("👉 NOW: Run 'node index.js' to start your server.");
} catch (err) {
    console.error("❌ ERROR: Could not write .env file:", err);
}