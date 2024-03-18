require("dotenv").config();
const jwt = require("jsonwebtoken");
const SALT = process.env.SALT;

function generateToken(id, mail,role) {

  return jwt.sign({ id, mail,role }, SALT);
}

module.exports = generateToken;
