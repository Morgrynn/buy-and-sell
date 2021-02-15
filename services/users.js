const userData = require('../components/Users');

module.exports = {
  getUserById: (id) => userData.find((user) => user.userId == id),
  getAllUsers: () => userData,
  findUserByName: (username) => userData.find(user => user.username == username),
  findUserByEmail: (email) => userData.find(user => user.email == email),
};
