const { v4: uuidv4 } = require('uuid');
const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../json/jwtKey.json');

exports.registration = async (req, res, next) => {
  try {
    const { email, username, name, address, phone } = req.body;
    const password = bcrypt.hashSync(req.body.password, 6);
    const user = {
      userId: uuidv4(),
      email: email,
      username: username,
      password: password,
      firstname: name.firstname,
      lastname: name.lastname,
      street: address.street,
      number: address.number,
      postcode: address.postcode,
      city: address.city,
      country: address.country,
      phone: phone,
      createDate: new Date().toISOString().slice(0, 10),
    };
    await Users.createNew(user);
    res.status(201).json({
      msg: 'Registration completed.',
      userId: user.userId,
    });
  } catch (error) {
    res.status(400).json({
      reason: error,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await Users.findUserByUsername(req.user.username);
    const body = { id: result.userid };
    const payload = { user: body };
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, jwtSecretKey.key, options);
    return res.status(200).json({ token: token, userId: body.id });
  } catch (error) {
    res.status(400).json({ reason: error });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await Users.getUserById(req.params.id);
    delete user.password;
    res.status(200).json({
      msg: 'User details',
      user: user,
    });
  } catch (error) {
    res.status(404).json({
      reason: error,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { username, name, address, phone } = req.body;
    const password = bcrypt.hashSync(req.body.password, 6);
    const result = await Users.getUserById(req.params.id);
    if (result == false) {
      res.status(401).json({ reason: 'UserId not found' });
    } else {
      await Users.update(
        {
          username: username,
          password: password,
          firstname: name.firstname,
          lastname: name.lastname,
          street: address.street,
          number: address.number,
          postcode: address.postcode,
          city: address.city,
          country: address.country,
          phone: phone,
          createDate: new Date().toISOString().slice(0, 10),
        },
        req.params.id
      );
      res.status(201).send();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      reason: error,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await Users.deleteById(req.params.id);

    if (result == false) {
      res.status(404).json({ reason: 'UserId not found' });
    } else {
      res.status(200).send();
    }
  } catch (error) {
    res.status(401).json({
      reason: error,
    });
  }
};
