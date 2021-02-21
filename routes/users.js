const express = require('express');
const router = express.Router();
const passportInstance = require('./passportAuthConfig');
const userCreatedSchema = require('../schemas/userCreatedSchema.json');
const Ajv = require('ajv').default;
const userController = require('../controllers/users');

/**
 * Middleware
 */
validateRequests = (req, res, next) => {
  const ajv = new Ajv();
  const validate = ajv.compile(userCreatedSchema);
  const valid = validate(req.body);
  if (!valid) {
    // console.log('Validation Errors: User Schema >>', validate.errors);
    return res.status(400).send(validate.errors.map((e) => e.message));
  }
  next();
};

router.post('/signup', validateRequests, userController.registration);
router.post(
  '/login',
  passportInstance.authenticate('basic', { session: false }),
  userController.login
);
router.get(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  userController.getUser
);
router.put(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  userController.updateUser
);
router.delete(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  userController.deleteUser
);

module.exports = router;
