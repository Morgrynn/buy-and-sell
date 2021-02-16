const express = require('express');
const router = express.Router();
const passportInstance = require('./passportAuthConfig');
const userCreatedSchema = require('../schemas/userCreatedSchema.json');
const Ajv = require('ajv').default;
const userController = require('../controllers/users');

validateRequests = (req, res, next) => {
  const ajv = new Ajv();
  const validate = ajv.compile(userCreatedSchema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).send(validate.errors.map((e) => e.message));
  }
  next();
};

router.post('/signup', validateRequests, userController.signup);

router.post(
  '/login',
  passportInstance.authenticate('basic', { session: false }),
  userController.login
);

router.get(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  userController.getUser
);

router.put(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  userController.updateUser
);
router.delete(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  userController.deleteUser
);

module.exports = router;
