const client = require("./db");

async function isReady() {
  try {
    const tableCheckQuery = `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = $1
        );
      `;

    const createTableQueries = [
      `
         CREATE TABLE classes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        INSERT INTO classes (name) VALUES ('Excursions from Hurghada');
        INSERT INTO classes (name) VALUES ('Excursions from Marsa Alam');
        INSERT INTO classes (name) VALUES ('Excursions from El-Ouseir');
        INSERT INTO classes (name) VALUES ('Safaga Excursions')
        `,
      `
      CREATE TABLE IF NOT EXISTS images (
        image_id VARCHAR(255) PRIMARY KEY,
        image VARCHAR(255) NOT NULL
      )
      `,
      `
        CREATE TABLE IF NOT EXISTS blogs (
          id VARCHAR(255) PRIMARY KEY,
          description VARCHAR(1000) NOT NULL,
          date VARCHAR(255) NOT NULL 
        )
      `,
      `
          CREATE TABLE IF NOT EXISTS trips (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(300),
            price INT NOT NULL,
            vehicle VARCHAR(300),
            duration VARCHAR(300),
            gudinjg VARCHAR(300),
            description VARCHAR(1500) NOT NULL,
            image VARCHAR(300) NOT NULL
        )        
          `,
      `
          CREATE TABLE IF NOT EXISTS trips_type (
           trip_id VARCHAR(255) REFERENCES trips(id) ON DELETE CASCADE,
           type INT REFERENCES classes(id) ON DELETE CASCADE
          )        
          `,
      `
        CREATE TABLE IF NOT EXISTS contactus (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          mail VARCHAR(255) NOT NULL ,
          description VARCHAR(600) NOT NULL 
          )
        `,
      `
        CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          mail VARCHAR(255) NOT NULL UNIQUE ,
          role VARCHAR(255) NOT NULL DEFAULT 'user',
          pass VARCHAR(255) NOT NULL ,
          verify_code VARCHAR(255)
        )
        `,
      `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES accounts(id) NOT NULL,
          name VARCHAR(255) NOT NULL,
          trip_id VARCHAR(255) REFERENCES trips(id) NOT NULL,
          number_of_person INT NOT NULL,
          arrivaldate VARCHAR(255) NOT NULL,
          departuredate VARCHAR(255) NOT NULL,
          flight_number VARCHAR(255) NOT NULL,
          hotel_name VARCHAR(255) NOT NULL,
          room_num VARCHAR(255) NOT NULL,
          paid BOOLEAN DEFAULT FALSE,
          o_id VARCHAR(255) 
         )
        `,
    ];

    const tablesToCheck = [
      "classes",
      "images",
      "blogs",
      "trips",
      "trips_type",
      "contactus",
      "accounts",
      "orders",
    ];

    let c = 0;

    for (let i = 0; i < tablesToCheck.length; i++) {
      const res = await client.query(tableCheckQuery, [tablesToCheck[i]]);
      const existingTable = res.rows[0].exists;

      if (!existingTable) {
        await client.query(createTableQueries[i]);
        c++;
      }
    }

    console.log(`${c} tables created successfully!`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = isReady;



// const client = require("./db");

// async function isReady() {
//   try {
//     const tableCheckQuery = `
//         SELECT EXISTS (
//           SELECT 1
//           FROM information_schema.tables
//           WHERE table_name = $1
//         );
//       `;

//     const createTableQueries = [
//       `
//          CREATE TABLE classes (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(255) NOT NULL,
//         );
//         INSERT INTO classes (name) VALUES ('Excursions from Hurghada');
//         INSERT INTO classes (name) VALUES ('Excursions from Marsa Alam');
//         INSERT INTO classes (name) VALUES ('Excursions from El-Ouseir');
//         INSERT INTO classes (name) VALUES ('Safaga Excursions');
//         `,
//       `
//       CREATE TABLE IF NOT EXISTS images (
//         image_id VARCHAR(255) PRIMARY KEY,
//         image VARCHAR(255) NOT NULL
//       );
//       `,
//       `
//         CREATE TABLE IF NOT EXISTS blogs (
//           id VARCHAR(255) PRIMARY KEY,
//           description VARCHAR(1000) NOT NULL,
//           date VARCHAR(255) NOT NULL 
//         );
//       `,
//       `
//           CREATE TABLE IF NOT EXISTS trips (
//             id VARCHAR(255) PRIMARY KEY,
//             name VARCHAR(300),
//             price INT NOT NULL,
//             vehicle VARCHAR(300),
//             duration VARCHAR(300),
//             gudinjg VARCHAR(300),
//             description VARCHAR(1500) NOT NULL,
//             image VARCHAR(300) NOT NULL
//         );        
//           `,
//       `
//           CREATE TABLE IF NOT EXISTS trips_type (
//            trip_id VARCHAR(255) REFERENCES trips(id) ON DELETE CASCADE,
//            type INT REFERENCES classes(id) ON DELETE CASCADE
//           );        
//           `,
//       `
//         CREATE TABLE IF NOT EXISTS contactus (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(255) NOT NULL,
//           mail VARCHAR(255) NOT NULL ,
//           description VARCHAR(600) NOT NULL 
//           );
//         `,
//       `
//         CREATE TABLE IF NOT EXISTS accounts (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(255) NOT NULL,
//           mail VARCHAR(255) NOT NULL UNIQUE ,
//           role VARCHAR(255) NOT NULL DEFAULT 'user',
//           pass VARCHAR(255) NOT NULL ,
//           verify_code VARCHAR(255)
//         );
//         `,
//       `
//         CREATE TABLE IF NOT EXISTS orders (
//           id SERIAL PRIMARY KEY,
//           user_id INT REFERENCES accounts(id) NOT NULL,
//           name VARCHAR(255) NOT NULL,
//           trip_id VARCHAR(255) REFERENCES trips(id) NOT NULL,
//           number_of_person INT NOT NULL,
//           arrivaldate VARCHAR(255) NOT NULL,
//           departuredate VARCHAR(255) NOT NULL,
//           flight_number INT NOT NULL,
//           hotel_name VARCHAR(255) NOT NULL,
//           room_num VARCHAR(255) NOT NULL,
//           paid BOOLEAN DEFAULT FALSE,
//           o_id VARCHAR(255) 
//       );
      
//         `,
//     ];

//     const tablesToCheck = [
//       "classes",
//       "images",
//       "blogs",
//       "trips",
//       "trips_type",
//       "contactus",
//       "accounts",
//       "orders",
//     ];

//     let c = 0;

//     for (let i = 0; i < tablesToCheck.length; i++) {
//       const res = await client.query(tableCheckQuery, [tablesToCheck[i]]);
//       const existingTable = res.rows[0].exists;

//       if (!existingTable) {
//         await client.query(createTableQueries[i]);
//         c++;
//       }
//     }

//     console.log(`${c} tables created successfully!`);
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }

// module.exports = isReady;
