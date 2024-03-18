const isReady = require("./db/dbready");
const procedureReady = require("./db/isProcedureReady");
//const sanitizeInput = require("./middlewares/sanitizeinput");

require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT,
  helmet = require("helmet"),
  client = require("./db/db");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());


app.use("/api/classes",require("./routes/classes/classes"));
app.use("/api/types",require("./routes/typesforClass/types"));
app.use("/api/blogs",require("./routes/blogs/blog"));
app.use("/api/trips",require("./routes/trips/trip"));
app.use("/api/contactus",require("./routes/contactus/contactUs"));
app.use("/api/account",require("./routes/account/auth"));
app.use("/api/orders",require("./routes/order/order"));



app.get('/dealltable', async (req, res) => {
  try {
   
    let query = `SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;' FROM pg_tables WHERE schemaname = 'public';`;
    let result = await client.query(query);
    for (const row of result.rows) {
      const dropTableQuery = row['?column?'];
      await client.query(dropTableQuery);
    }

    // Drop all functions
    query = `SELECT 'DROP FUNCTION IF EXISTS "' || routine_name || '" CASCADE;' FROM information_schema.routines WHERE specific_schema = 'public' AND routine_type = 'FUNCTION';`;
    result = await client.query(query);
    for (const row of result.rows) {
      const dropFunctionQuery = row['?column?'];
      await client.query(dropFunctionQuery);
    }

    // Drop all procedures
    query = `SELECT 'DROP PROCEDURE IF EXISTS "' || proname || '" CASCADE;' FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');`;
    result = await client.query(query);
    for (const row of result.rows) {
      const dropProcedureQuery = row['?column?'];
      await client.query(dropProcedureQuery);
    }

    await client.end();
    res.json({ msg: "All tables, functions, and procedures deleted." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});   


























client
  .connect()
  .then(async() => {
    console.log("psql is connected ..");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
    await isReady();
    await procedureReady();
  })
  .catch((error) => console.log(error));
