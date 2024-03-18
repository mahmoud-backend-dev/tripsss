const client = require("../../db/db");
const isAdmin = require("../../middleware/isAdmin");
const isUser = require("../../middleware/isUser");
const {
  validateUser,
  validateLogin,
  validateEmail,
  validateResetpass,
} = require("../../models/user");
const express = require("express");
const generateToken = require("../../utils/account");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/registerAdmin", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.pass = await bcrypt.hash(req.body.pass, salt);

  const { name, mail, pass } = req.body;
  try {
    const query = `
        INSERT INTO accounts (name, mail, role, pass) 
        VALUES ($1, $2, 'admin', $3)
        RETURNING *;
      `;
    const values = [name, mail, pass];
    const result = await client.query(query, values);

    let token = generateToken(result.rows[0].id, mail, "admin");
    res.json({ success: true, token, role: result.rows[0].role });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(404).json({ msg: error.details[0].message });

    const salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);

    let { name, mail, pass } = req.body;

    let result = await client.query("SELECT register($1, $2, $3);", [
      name,
      mail,
      pass,
    ]);
    let id = result.rows[0].register; // Accessing the returned value using the correct alias
    console.log(id);
    let token = generateToken(id, mail, "user");
    res.json({ token, role: "user" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const { mail, pass } = req.body; // Destructuring the mail and pass directly

    // Assuming get_user function returns user information including hashed password
    const result = await client.query("SELECT * FROM get_user($1);", [mail]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "No user found for this account" }); // Correcting typo
    }

    const { id, pass: hashedPassword, role } = result.rows[0]; // Renaming pass to hashedPassword

    // Comparing the provided password with the hashed password using bcrypt
    const isPasswordMatch = await bcrypt.compare(pass, hashedPassword);

    if (isPasswordMatch) {
      // If password matches, generate and send JWT token
      const token = generateToken(id, mail, role); // Using mail from request body instead of result
      res.json({ token, role });
    } else {
      // If password doesn't match, return error message
      res.status(401).json({ msg: "Invalid email or password" }); // Correcting status code and message
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
