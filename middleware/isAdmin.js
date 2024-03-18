
const client = require("../db/db");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    try {
      const token = req.headers.token;
      const { id, mail ,role } = verifyToken(token);
      const sqlQuery = `SELECT role FROM accounts WHERE mail = $1 AND id = $2;`;
      const result = await client.query(sqlQuery, [mail, id]);
      if (result.rows[0].role=="admin") {
        next();
      } else {
        return res.status(403).json({ msg: "You do not have permission to perform this action." });
      }
    } catch (error) {
      return res.status(500).json({ msg: "TOKEN IS INVALID TOKEN" });
    }
  };
  

//   const isAdmin = async (req, res, next) => {
//         next();
//   };

  module.exports = isAdmin;  