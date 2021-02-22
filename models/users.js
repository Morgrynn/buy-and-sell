const db = require('../database');
// const { db } = require('../database');

const users = {
  checkIfExists: (username, callback) => {
    return db.query(
      'SELECT * FROM users_table WHERE username=$1',
      [username],
      callback
    );
  },
  createNew: async (user) => {
    return new Promise((resolve, reject) => {
      // Check if username is in use
      db.query(
        'SELECT * FROM users_table WHERE username = $1',
        [user.username],
        function (error, results) {
          if (error != null) {
            reject(error);
          }
          if (results.rows.length > 0) {
            reject('User exists');
          } else {
            // Create new user
            db.query(
              'INSERT INTO users_table (userId, email, username, password, firstname, lastname, street, number, postcode, city, country, phone, createDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
              [
                user.userId,
                user.email,
                user.username,
                user.password,
                user.firstname,
                user.lastname,
                user.street,
                user.number,
                user.postcode,
                user.city,
                user.country,
                user.phone,
                user.createDate,
              ]
            )
              .then((user) => {
                resolve(user);
              })
              .catch((error) => reject(error));
          }
        }
      );
    });
  },
  getUserById: async (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users_table WHERE userid = $1`,
        [userId],
        function (error, result) {
          if (result.rows === undefined || error != null) {
            reject(undefined);
          } else {
            resolve(result.rows[0]);
          }
        }
      );
    });
  },
  update: async (user, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          'UPDATE users_table set username=$1, password=$2, firstname=$3, lastname=$4, street=$5, number=$6, postcode=$7, city=$8, country=$9, phone=$10, createDate=$11 WHERE userid=$12',
          [
            user.username,
            user.password,
            user.firstname,
            user.lastname,
            user.street,
            user.number,
            user.postcode,
            user.city,
            user.country,
            user.phone,
            user.createDate,
            userId,
          ]
        );
        if (result) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch {
        reject(false);
      }
    });
  },
  findUserByUsername: async (username) => {
    return new Promise((resolve, reject) => {
      db.query(
        'select * from users_table where username=$1',
        [username],
        function (error, result) {
          if (result.rows === undefined || error != null) {
            reject(undefined);
          } else {
            resolve(result.rows[0]);
          }
        }
      );
    });
  },
  deleteById: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          'DELETE FROM users_table WHERE userid=$1',
          [userId]
        );
        if (result) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch {
        reject(false);
      }
    });
  },
};

module.exports = users;
