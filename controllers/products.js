const products = require('../services/products');
const Products = require('../models/products');
const Users = require('../models/users');
const fs = require('fs');

exports.getProducts = async (req, res, next) => {
  try {
    const qs = req.query;
    const category = req.query.category;
    const city = req.query.city;
    const country = req.query.country;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const result = await Products.getProducts();
    if (Object.entries(result).length === 0) {
      return res.status(404).json({ msg: 'Products Not Found.' });
    } else if (Object.entries(qs).length === 0) {
      // Returns All Products
      return res.status(200).json({ msg: 'Request Ok', products: result });
    } else {
      if (result === undefined) {
        res.status(404).send();
      } else {
        if (!city && !country && !startDate && !category) {
          res
            .status(404)
            .json({ msg: `Products with current query params Not Found.` });
          return;
        } else if (category) {
          const getProductsByCategory = await Products.searchByCategory(
            category.toLowerCase()
          );
          if (getProductsByCategory.length === 0) {
            return res
              .status(404)
              .json({ msg: `No Category named ${category}.` });
          }
          return res.status(200).json({
            msg: 'Request products by category Ok',
            products: getProductsByCategory,
          });
        } else if (city) {
          const getProductsByCity = await Products.searchByCity(
            city.toLowerCase()
          );
          if (getProductsByCity.length === 0) {
            return res.status(404).json({ msg: `No products from ${city}.` });
          }
          return res.status(200).json({
            msg: 'Request products by cities Ok',
            products: getProductsByCity,
          });
        } else if (country) {
          const getProductsByCountry = await Products.searchByCountry(
            country.toLowerCase()
          );
          if (getProductsByCountry.length === 0) {
            res.status(404).json({ msg: `No products from ${country}.` });
          }
          return res.status(200).json({
            products: getProductsByCountry,
          });
        } else if (startDate && endDate) {
          const getProductsBetweenDates = await Products.searchByEndDate(
            startDate,
            endDate
          );
          if (getProductsBetweenDates.length === 0) {
            return res.status(404).json({
              msg: `No products from ${startDate} & ${endDate}.`,
            });
          }
          res.status(200).json({
            msg: 'Request products by start and end dates Ok',
            products: getProductsBetweenDates,
          });
          return;
        } else if (startDate && !endDate) {
          const getProductsByDate = await Products.searchByStartDate(startDate);
          if (getProductsByDate.length === 0) {
            return res
              .status(404)
              .json({ msg: `No products from ${startDate}.` });
          }
          return res.status(200).json({
            msg: 'Request products by startDate Ok',
            products: getProductsByDate,
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      reason: error,
    });
  }
  // const qs = req.query;
  // const category = req.query.category;
  // const city = req.query.city;
  // const country = req.query.country;
  // const startDate = req.query.startDate;
  // const endDate = req.query.endDate;
  // // const result = products.getProducts();
  // const result = Products.getProducts();
  // if (Object.entries(result).length === 0) {
  //   return res.status(404).json({ msg: 'Products Not Found.' });
  // } else if (Object.entries(qs).length === 0) {
  //   // returns all products
  //   return res.status(200).json({ msg: 'Request Ok', products: result });
  // } else {
  //   if (!city && !country && !startDate && !category) {
  //     res
  //       .status(404)
  //       .json({ msg: `Products with current query params Not Found.` });
  //     return;
  //   } else if (category) {
  //     const getProductsByCategory = result.filter((product) => {
  //       if (product.category.toLowerCase() === category.toLowerCase()) {
  //         return product;
  //       }
  //     });
  //     if (getProductsByCategory.length === 0) {
  //       return res.status(404).json({ msg: `No Category named ${category}.` });
  //     }
  //     return res.status(200).json({
  //       msg: 'Request products by category Ok',
  //       products: getProductsByCategory,
  //     });
  //   } else if (city) {
  //     const getProductsByCity = result.filter((product) => {
  //       if (product.city.toLowerCase() === city.toLowerCase()) {
  //         return product;
  //       }
  //     });
  //     if (getProductsByCity.length === 0) {
  //       return res.status(404).json({ msg: `No products from ${city}.` });
  //     }
  //     return res.status(200).json({
  //       msg: 'Request products by cities Ok',
  //       products: getProductsByCity,
  //     });
  //   } else if (country) {
  //     const getProductsByCountry = result.filter((product) => {
  //       if (product.country.toLowerCase() === country.toLowerCase()) {
  //         return product;
  //       }
  //     });
  //     if (getProductsByCountry.length === 0) {
  //       return res.status(404).json({ msg: `No products from ${country}.` });
  //     }
  //     return res.status(200).json({
  //       products: getProductsByCountry,
  //     });
  //   } else if (startDate && endDate) {
  //     const resultProductData = result.filter((a) => {
  //       const date = a.createDate;
  //       return date >= startDate && date <= endDate;
  //     });
  //     if (resultProductData.length === 0) {
  //       return res.status(404).json({
  //         msg: `No products from ${startDate} & ${endDate}.`,
  //       });
  //     }
  //     res.status(200).json({
  //       msg: 'Request products by start and end dates Ok',
  //       products: resultProductData,
  //     });
  //     return;
  //   } else if (startDate && !endDate) {
  //     const resultProductData = result.filter((a) => {
  //       const date = a.createDate;
  //       return date >= startDate;
  //     });
  //     if (resultProductData.length === 0) {
  //       return res.status(404).json({ msg: `No products from ${startDate}.` });
  //     }
  //     return res.status(200).json({
  //       msg: 'Request products by startDate Ok',
  //       products: resultProductData,
  //     });
  //   }
  // }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await Products.getProductById(productId);
    if (result === undefined) {
      res
        .status(404)
        .json({ msg: 'The product with provided ID does not exist!' });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    res.status(400).json({
      reason: error,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Users.getUserById(userId);
    const categories = products.getCategoryNames();
    const categoryInfo = products.getCatByName(req.body.category);
    if (!categoryInfo) {
      res
        .status(400)
        .json({ msg: `Category doesn't exist see list ${categories}` });
    } else {
      const { title, description, city, country, price, shipping } = req.body;
      const { images } = req.files;
      if (!images) {
        res.json(req.files);
        // res.status(400).json({
        //   error: 'No images attached',
        // });
      } else if (Object.values(images).length === 1) {
        (image) => fs.rename(image.path, './uploads/' + image.originalname);
      } else {
        // images.forEach((image) => {
        //   fs.renameSync(image.path, './uploads/' + image.originalname);
        // });
        console.log(req.file);
        res.status(201);
        res.json(req.file);
      }
      // TODO TypeError
      let imageUrl = images.map((image) => image.path);
      let pickup;
      if (shipping === 'true') {
        pickup = false;
      } else {
        pickup = true;
      }
      const newProduct = {
        title: title,
        description: description,
        city: city,
        country: country,
        images: imageUrl,
        price: parseFloat(price),
        shipping: shipping,
        pickup: pickup,
        userId: userId,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        phone: result.phone,
        category: categoryInfo.name,
        categoryId: categoryInfo.id,
        created_on: new Date().toISOString().slice(0, 10),
      };
      await Products.addProduct(newProduct);
      res.status(201).json({
        msg: 'Registration completed.',
        product: newProduct,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      reason: error,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const checkId = await Products.getProductById(productId);
    const result = await Products.getProductByUserId(userId);
    if (!checkId) {
      return res
        .status(404)
        .json({ msg: 'The product with provided ID does not exist!' });
    }
    if (result === undefined) {
      return res.status(401).json({ msg: 'Unauthorized' });
    } else {
      const categories = products.getCategoryNames();
      const categoryInfo = products.getCatByName(req.body.category);
      const { images } = req.files;
      if (!categoryInfo) {
        res.status(400).json({
          msg: `Category  ${req.body.category}  doesn't exist see list: ${categories}`,
        });
      } else {
        if (!images) {
          res.status(400).json({
            error: 'No images attached',
          });
        } else {
          updatedImages = images.map((image) => {
            return image.path;
          });
          let pickup;
          if (req.body.shipping === 'true') {
            pickup = false;
          } else {
            pickup = true;
          }
          await Products.updateProduct(
            {
              title: (result.title = req.body.title
                ? req.body.title
                : result.title),
              description: (result.description = req.body.description
                ? req.body.description
                : result.description),
              city: (result.city = req.body.city ? req.body.city : result.city),
              country: (result.country = req.body.country
                ? req.body.country
                : result.country),
              images: (result.images = updatedImages
                ? updatedImages
                : result.images),
              price: (result.price = req.body.price
                ? req.body.price
                : result.price),
              shipping: (result.shipping = req.body.shipping
                ? req.body.shipping
                : result.shipping),
              pickup: pickup,
              category: (result.category = req.body.category
                ? req.body.category
                : result.category),
              categoryId: (result.categoryid = categoryInfo.id
                ? categoryInfo.id
                : result.categoryid),
            },
            productId
          );

          res.status(201).json({
            msg: 'Product updated.',
            product: result,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      reason: error,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const checkId = await Products.getProductById(productId);
    const result = await Products.deleteProduct(productId, userId);
    if (!checkId) {
      return res
        .status(404)
        .json({ msg: 'The product with provided ID does not exist!' });
    }
    if (result === undefined) {
      return res.status(401).json({ msg: 'Unauthorized' });
    } else {
      res.status(200).json({ msg: 'Product Deleted.' });
    }
  } catch (error) {
    res.status(400).json({
      reason: error,
    });
  }
};
