const bcrypt = require("bcrypt");
const password = "Student123!";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log("HASH:", hash);
console.log("MATCH:", bcrypt.compareSync(password, hash));
