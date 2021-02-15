const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

const userComponent = require('./routes/users');
const productComponent = require('./routes/products');

// Routes
app.use('/users', userComponent);
app.use('/products', productComponent);

// Error handling
// app.use((req, res, next) => {
//   const error = new Error('Not found');
//   error.status = 404;
//   next(error);
// });

let server = null;

module.exports = {
  start: function (mode) {
    server = app.listen(process.env.PORT, process.env.HOST, () => {
      console.log(
        `App listening at http://${process.env.HOST}:${process.env.PORT}`
      );
    });
  },
  close: function () {
    server.close();
  },
};
