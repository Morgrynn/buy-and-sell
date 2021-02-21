const db = require('../database');

const products = {
  getProducts: async () => {
    return new Promise((resolve, reject) => {
      try {
        db.query('SELECT * FROM products_table', function (error, result) {
          if (result.rows === undefined || error != null) {
            reject(undefined);
          } else {
            resolve(result.rows);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
  getProductById: async (productId) => {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          'SELECT * FROM products_table WHERE productid=$1',
          [productId],
          function (error, result) {
            if (result.rows === undefined || error != null) {
              reject(undefined);
            } else {
              resolve(result.rows[0]);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  },
  getProductByUserId: async (userId) => {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          'SELECT * FROM products_table WHERE userid = $1',
          [userId],
          function (error, result) {
            if (result.rows === undefined || error != null) {
              reject(undefined);
            } else {
              resolve(result.rows[0]);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  },
  addProduct: async (product) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .query(
            'INSERT INTO products_table (title, description, city, country, images, price, shipping, pickup, userId, firstname, lastname, email, phone, category, categoryId, created_on ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
            [
              product.title,
              product.description,
              product.city,
              product.country,
              product.images,
              product.price,
              product.shipping,
              product.pickup,
              product.userId,
              product.firstname,
              product.lastname,
              product.email,
              product.phone,
              product.category,
              product.categoryId,
              product.created_on,
            ]
          )
          .then((result) => {
            resolve(result);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  updateProduct: async (product, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          'UPDATE products_table set title=$1, description=$2, city=$3, country=$4, images=$5, price=$6, shipping=$7, pickup=$8, category=$9, categoryid=$10 WHERE productid=$11',
          [
            product.title,
            product.description,
            product.city,
            product.country,
            product.images,
            product.price,
            product.shipping,
            product.pickup,
            product.category,
            product.categoryId,
            productId,
          ]
        );
        if (result) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  },
  deleteProduct: async (productId, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          'DELETE FROM products_table WHERE productId=$1 AND userid=$2',
          [productId, userId]
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
  searchByCity: async (value) => {
    return new Promise((resolve, reject) => {
      try {
        const cityLike = '%' + value.toLowerCase() + '%';
        db.query(
          'SELECT * FROM products_table WHERE city ILIKE $1 order by productid asc',
          [cityLike]
        ).then((result) => {
          resolve(result.rows);
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
  searchByCountry: async (value) => {
    return new Promise((resolve, reject) => {
      try {
        const countryLike = '%' + value.toLowerCase() + '%';
        db.query(
          'SELECT * FROM products_table WHERE country ILIKE $1 order by productid asc',
          [countryLike]
        ).then((result) => {
          resolve(result.rows);
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
  searchByCategory: async (value) => {
    return new Promise((resolve, reject) => {
      try {
        const categoryLike = '%' + value.toLowerCase() + '%';
        db.query(
          'SELECT * FROM products_table WHERE category ILIKE $1 order by productid asc',
          [categoryLike]
        ).then((result) => {
          resolve(result.rows);
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
  searchByStartDate: async (startDate) => {
    return new Promise((resolve, reject) => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        db.query(
          'SELECT * FROM products_table WHERE created_on BETWEEN $1 AND $2 order by productid asc',
          [startDate, today]
        ).then((result) => {
          resolve(result.rows);
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
  searchByEndDate: async (start, end) => {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          'SELECT * FROM products_table WHERE created_on BETWEEN $1 AND $2 order by productid asc',
          [start, end]
        ).then((result) => {
          resolve(result.rows);
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
};

module.exports = products;
