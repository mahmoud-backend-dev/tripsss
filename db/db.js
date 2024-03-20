// require("dotenv").config();
// const pg = require("pg");

// Read the database connection details from the environment variables
// const database = process.env.DATABASE;

// // Configure the SSL/TLS options
// const sslConfig = {
//   rejectUnauthorized: false, // This line allows self-signed certificates; remove it for production use with valid certificates
// };

// // Create a new PostgreSQL client with SSL/TLS enabled
// const client = new pg.Client({
//   connectionString: database,
//   ssl: sslConfig,
// });


// module.exports = client;

// commit test

require("dotenv").config();
const pg = require("pg");

const database = process.env.DATABASE;

const client = new pg.Client({
  connectionString: database,
});

module.exports = client;
