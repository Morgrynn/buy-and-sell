const productData = require('../components/Products');
const categoryData = require('../components/Categories');

module.exports = {
  getProducts: () => productData,
  getProductById: (id) =>
    productData.find((product) => product.productId == id),
  getProductByUserId: (id) =>
    productData.find((product) => product.userId == id),
  getCity: (city) =>
    productData.filter((product) => product.location.city == city),
  getCountry: (country) =>
    productData.filter((product) => product.location.country == country),
  getDate: (startDate, endDate) =>
    productData.filter((product) => {
      if (product.createDate >= startDate && product.createDate <= endDate) {
        return product;
      }
    }),
  getCatByName: (name) => categoryData.find((cat) => cat.name == name),
  getCategoryNames: () => categoryData.map((cat) => cat.name),
};
