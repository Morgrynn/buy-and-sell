const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');

app.set('port', process.env.PORT || 80);

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
    server = app.listen(app.get('port'), () => {
      console.log('Node app is running on port', app.get('port'));
    });
  },
  close: function () {
    server.close();
  },
};
