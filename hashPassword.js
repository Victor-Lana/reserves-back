const bcrypt = require('bcrypt');

async function hashPassword() {
    const password = 'teste'; 
    const saltRounds = 10; 
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash); 
}

// npm install bcrypt

// node hashPassword.js

hashPassword();
