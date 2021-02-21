const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');

// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

const userComponent = require('./routes/users');
const productComponent = require('./routes/products');

// Routes
app.use('/users', userComponent);
app.use('/products', productComponent);

let server = null;

module.exports = {
  start: function () {
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
