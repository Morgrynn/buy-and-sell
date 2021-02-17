const products = require('../services/products');
const users = require('../services/users');
const productData = require('../components/Products');
const fs = require('fs');

exports.getProducts = (req, res, next) => {
  const qs = req.query;
  const category = req.query.category;
  const city = req.query.city;
  const country = req.query.country;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const result = products.getProducts();
  if (Object.entries(result).length === 0) {
    return res.status(404).json({ msg: 'Products Not Found.' });
  } else if (Object.entries(qs).length === 0) {
    // returns all products
    return res.status(200).json({ msg: 'Request Ok', products: result });
  } else {
    if (!city && !country && !startDate && !category) {
      res
        .status(404)
        .json({ msg: `Products with current query params Not Found.` });
      return;
    } else if (category) {
      const getProductsByCategory = result.filter((product) => {
        if (product.category.toLowerCase() === category.toLowerCase()) {
          return product;
        }
      });
      if (getProductsByCategory.length === 0) {
        return res.status(404).json({ msg: `No Category named ${category}.` });
      }
      return res.status(200).json({
        msg: 'Request products by category Ok',
        products: getProductsByCategory,
      });
    } else if (city) {
      const getProductsByCity = result.filter((product) => {
        if (product.city.toLowerCase() === city.toLowerCase()) {
          return product;
        }
      });
      if (getProductsByCity.length === 0) {
        return res.status(404).json({ msg: `No products from ${city}.` });
      }
      return res.status(200).json({
        msg: 'Request products by cities Ok',
        products: getProductsByCity,
      });
    } else if (country) {
      const getProductsByCountry = result.filter((product) => {
        if (product.country.toLowerCase() === country.toLowerCase()) {
          return product;
        }
      });
      if (getProductsByCountry.length === 0) {
        return res.status(404).json({ msg: `No products from ${country}.` });
      }
      return res.status(200).json({
        products: getProductsByCountry,
      });
    } else if (startDate && endDate) {
      const resultProductData = result.filter((a) => {
        const date = a.createDate;
        return date >= startDate && date <= endDate;
      });
      if (resultProductData.length === 0) {
        return res.status(404).json({
          msg: `No products from ${startDate} & ${endDate}.`,
        });
      }
      res.status(200).json({
        msg: 'Request products by start and end dates Ok',
        products: resultProductData,
      });
      return;
    } else if (startDate && !endDate) {
      const resultProductData = result.filter((a) => {
        const date = a.createDate;
        return date >= startDate;
      });
      if (resultProductData.length === 0) {
        return res.status(404).json({ msg: `No products from ${startDate}.` });
      }
      return res.status(200).json({
        msg: 'Request products by startDate Ok',
        products: resultProductData,
      });
    }
  }
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  const result = products.getProductById(productId);
  if (!result) {
    return res
      .status(404)
      .json({ msg: 'The product with provided ID does not exist!' });
  } else {
    return res.status(200).json({
      msg: 'Product Request OK',
      product: result,
    });
  }
};

exports.createProduct = (req, res, next) => {
  const userId = req.user.id;
  const result = users.getUserById(userId);
  if (!result) {
    return res.status(401).json({ msg: 'Unauthorized' });
  } else {
    const { name, email, phone } = result;
    const categories = products.getCategoryNames();
    const categoryInfo = products.getCatByName(req.body.category);
    if (!categoryInfo) {
      return res
        .status(400)
        .json({ msg: `Category doesn't exist see list ${categories}` });
    } else {
      const { title, description, city, country, price, shipping } = req.body;
      const { images } = req.files;
      if (!images) {
        return res.status(400).json({
          error: 'No images attached',
        });
      } else if (Object.values(images).length === 1) {
        (image) => fs.rename(image.path, './uploads/' + image.originalname);
      } else {
        images.forEach((image) => {
          fs.renameSync(image.path, './uploads/' + image.originalname);
        });
      }
      productData.push({
        productId: productData.length + 1,
        title,
        description,
        city,
        country,
        images,
        price: parseFloat(price),
        shipping: Boolean(shipping),
        pickup: Boolean(!shipping),
        userId,
        user: {
          name: name,
          email: email,
          phone: phone,
        },
        category: categoryInfo.name,
        categoryId: categoryInfo.id,
        createDate: new Date().toISOString().slice(0, 10),
      });
      const product =
        productData[
          Object.keys(productData)[Object.keys(productData).length - 1]
        ];
      return res.status(201).json({
        msg: 'Product created.',
        product: product,
      });
    }
  }
};

exports.updateProduct = (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  const checkId = products.getProductById(productId);
  const result = products.getProductByUserId(userId);
  if (!checkId) {
    return res
      .status(404)
      .json({ msg: 'The product with provided ID does not exist!' });
  }
  if (!result) {
    return res.status(401).json({ msg: 'Unauthorized' });
  } else {
    const categories = products.getCategoryNames();
    const categoryInfo = products.getCatByName(req.body.category);
    const { images } = req.files;
    if (!categoryInfo) {
      return res.status(400).json({
        msg: `Category  ${req.body.category}  doesn't exist see list: ${categories}`,
      });
    } else {
      if (!images) {
        return res.status(400).json({
          error: 'No images attached',
        });
      } else {
        updatedImages = images.map((image) => {
          return image;
        });
        result.title = req.body.title ? req.body.title : result.title;
        result.description = req.body.description
          ? req.body.description
          : result.description;
        result.city = req.body.city ? req.body.city : result.city;
        result.country = req.body.country ? req.body.country : result.country;
        result.images = updatedImages ? updatedImages : result.images;
        result.price = req.body.price ? req.body.price : result.price;
        result.shipping = req.body.shipping
          ? req.body.shipping
          : result.shipping;
        result.category = req.body.category
          ? req.body.category
          : result.category;
        return res.status(201).json({
          msg: 'Product updated.',
          product: result,
        });
      }
    }
  }
};

exports.deleteProduct = (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  const checkId = products.getProductById(productId);
  const result = products.getProductByUserId(userId);
  if (!checkId) {
    return res
      .status(404)
      .json({ msg: 'The product with provided ID does not exist!' });
  }
  if (!result) {
    return res.status(401).json({ msg: 'Not Authorized.' });
  }
  if (result) {
    const index = products.getProducts().indexOf(checkId);
    let removed = products.getProducts().splice(index, 1);
    // TODO: REMEMBER JSON MSG ONLY USED FOR DEBUGGING RESET STATUSCODE
    res.status(200).json({ msg: 'Product Deleted.', products: removed });
    // res.status(204).end();
  }
};
