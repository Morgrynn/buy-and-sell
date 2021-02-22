// const Pool = require('pg').Pool;
const { Pool, Client } = require('pg');

const dotenv = require('dotenv');

dotenv.config();

const connectionString = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}`;

const connectionTestString = `postgresql://${process.env.TEST_DATABASE_USERNAME}:${process.env.TEST_DATABASE_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.TEST_DATABASE_NAME}`;

// process.env.NODE_ENV = 'test';
process.env.NODE_ENV === 'production';
let pool;
// const string = new Pool({
//   user: process.env.DATABASE_USERNAME,
//   host: process.env.HOST,
//   database: process.env.DATABASE_NAME,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DB_PORT,
//   max: 10,
//   idleTimeoutMillis: 3000,
// });
// const stringTest = new Pool({
//   user: process.env.TEST_DATABASE_USERNAME,
//   host: process.env.DB_HOST,
//   database: process.env.TEST_DATABASE_NAME,
//   password: process.env.TEST_DATABASE_PASSWORD,
//   port: process.env.DB_PORT,
//   max: 10,
//   idleTimeoutMillis: 3000,
// });
// if (process.env.NODE_ENV === 'test') {
//   pool = new Pool({
//     connectionString,
//   });
//   console.log('DATABASE NAME: ', pool.options.connectionString);
// } else {
//   pool = new Pool({
//     connectionString: process.env.PROD_DATABASE_URL,
//   });
//   console.log('DATABASE NAME: ', pool.options.connectionString);
// }

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: connectionString,
  });
  console.log(pool.options.connectionString);
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    connectionString: connectionTestString,
  });
  console.log(pool.options.connectionString);
  // console.log('DATABASE NAME: ', connection.options.database);
  // console.log('DATABASE NAME: ', pool.options.database);
}
// else {
//   pool = string;
//   console.log('DATABASE NAME: ', pool.options.database);
// }

// const isProduction = process.env.NODE_ENV === 'production';
// // const connectionString = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}`;
// const connectionString = process.env.TEST_DATABASE_URL

// const pool = new Pool({
//   connectionString: isProduction
//     ? process.env.PROD_DATABASE_URL
//     : connectionString,
// });
// console.log(pool.options.connectionString);

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// module.exports = connection;
module.exports = { pool };
