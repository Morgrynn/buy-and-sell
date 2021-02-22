const Pool = require('pg').Pool;

const dotenv = require('dotenv');

dotenv.config();

// process.env.NODE_ENV = 'test';
process.env.NODE_ENV === 'production';
let connection;
const string = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000,
});
const stringTest = new Pool({
  user: process.env.TEST_DATABASE_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.TEST_DATABASE_NAME,
  password: process.env.TEST_DATABASE_PASSWORD,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000,
});
if (process.env.NODE_ENV === 'production') {
  connection = string;
  console.log('DATABASE NAME: ', connection.options.database);
} else if (process.env.NODE_ENV === 'test') {
  connection = stringTest;
  console.log('DATABASE NAME: ', connection.options.database);
} else {
  connection = string;
  console.log('DATABASE NAME: ', connection.options.database);
}

// const connection = new Pool({
//   user: process.env.DATABASE_USERNAME,
//   host: process.env.HOST,
//   database: process.env.DATABASE_NAME,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DB_PORT,
//   max: 10,
//   idleTimeoutMillis: 3000,
// });

module.exports = connection;
