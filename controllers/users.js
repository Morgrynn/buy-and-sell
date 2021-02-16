const { v4: uuidv4 } = require('uuid');
const users = require('../services/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../json/jwtKey.json');
const userData = require('../components/Users');

exports.signup = (req, res, next) => {
  const { email, username, name, address, phone } = req.body;
  const password = bcrypt.hashSync(req.body.password, 6);
  let newUser;
  const result = users.findUserByEmail(email);
  if (result) {
    return res
      .status(400)
      .json({ msg: 'Email address already in system. Please login.' });
  } else {
    newUser = {
      userId: uuidv4(),
      email,
      username,
      password,
      name,
      address,
      phone,
      createDate: new Date().toISOString().slice(0, 10),
    };
    userData.push(newUser);
    // TODO: REMEMBER JSON MSG AND USERDATA ONLY USED FOR DEBUGGING
    return res.status(201).json({
      msg: 'Registration completed.',
      userCreated: { userId: newUser.userId },
    });
  }
};

exports.login = (req, res, next) => {
  const username = req.user.username;
  const password = req.user.password;
  const result = users.findUserByName(username);
  if (!result) {
    const error = new Error('Not Authorized');
    error.statusCode = 401;
    throw error;
  } else {
    bcrypt.compare(password, result.password, (err, res) => {
      if (err) {
        const error = new Error('Password Incorrect');
        error.statusCode = 401;
        throw error;
      }
      if (res) {
        return res.status(200).json({
          msg: 'Authorization Successful',
        });
      }
    });
  }
  const body = { id: result.userId };
  const payload = { user: body };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, jwtSecretKey.key, options);
  return res.status(200).json({ token: token, userId: body.id });
};

exports.getUser = (req, res, next) => {
  const userId = req.user.id;
  const result = users.getUserById(userId);
  if (!result) {
    return res.status(403).json({ msg: 'Not Authorized.' });
  } else {
    return res.status(200).json({
      msg: 'User details',
      user: result,
    });
  }
};

exports.updateUser = (req, res, next) => {
  const userId = req.user.id;
  const result = users.getUserById(userId);
  if (!result) {
    return res.status(403).json({ msg: 'Not Authorized.' });
  } else {
    const updateUser = req.body;
    const newPassword = bcrypt.hashSync(updateUser.password, 6);
    const newDate = new Date().toISOString().slice(0, 10)
    result.username = updateUser.username ? updateUser.username : result.username;
    result.password = newPassword ? newPassword : result.password;
    result.name = updateUser.name ? updateUser.name : result.name;
    result.address = updateUser.address ? updateUser.address : result.address;
    result.phone = updateUser.phone ? updateUser.phone : result.phone;
    result.createDate = newDate ? newDate : result.createDate;
    // TODO: REMEMBER JSON MSG AND USERDATA ONLY USED FOR DEBUGGING
    res.status(201).json({
      msg: 'User updated.',
      user: result
    });
  }
};

exports.deleteUser = (req, res, next) => {
  const userId = req.user.id;
  const result = users.getUserById(userId);
  if (!result) {
    return res.status(403).json({ msg: 'Not Authorized.' });
  }
  if (result) {
    const index = users.getAllUsers().indexOf(result);
    let removed = users.getAllUsers().splice(index, 1);
    // TODO: REMEMBER JSON MSG AND USERDATA ONLY USED FOR DEBUGGING RESET STATUSCODE
    return res.json({ msg: 'User Deleted.', users: removed });
    // res.status(204).end();
  }
};
