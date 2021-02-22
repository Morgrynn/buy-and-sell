const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');

const port = process.env.PORT || 3000;

// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

const userComponent = require('./routes/users');
const productComponent = require('./routes/products');

// Routes
app.use('/users', userComponent);
app.use('/products', productComponent);

app.get('/', function (req, res) {
  res.send('Hello There!');
});

let server = null;

module.exports = {
  start: function () {
    server = app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  },
  close: function () {
    server.close();
  },
};
