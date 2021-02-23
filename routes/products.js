const express = require('express');
const router = express.Router();
const passportInstance = require('./passportAuthConfig');
const Ajv = require('ajv').default;
const ProductSchema = require('../schemas/productSchema.json');
const productController = require('../controllers/products');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const multerUpload = multer({ dest: 'uploads/' });
const products = require('../models/products');

/**
 * Middleware
 */
validateRequests = (req, res, next) => {
  const ajv = new Ajv();
  const validate = ajv.compile(ProductSchema);
  const valid = validate(req.body);
  if (!valid) {
    // console.log('Validation Errors: ProductSchema >>', validate.errors);
    return res.status(400).send(validate.errors.map((e) => e.message));
  }
  next();
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multerUpload.fields(
  [
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 4 },
  ],
  { fileFilter: fileFilter }
);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: './uploads/', // give cloudinary folder where you want to store images
  allowedFormats: ['jpg', 'png', 'jpeg'],
});

const parser = multer({ storage: storage });

/**
 * Routes
 */
router.get('', productController.getProducts);
router.get('/:productId', productController.getProductById);
router.post(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  parser.array('images'),
  validateRequests,
  productController.createProduct
);
router.put(
  '/:productId',
  passportInstance.authenticate('jwt', { session: false }),
  upload,
  validateRequests,
  productController.updateProduct
);
router.delete(
  '/:productId',
  passportInstance.authenticate('jwt', { session: false }),
  productController.deleteProduct
);

module.exports = router;
