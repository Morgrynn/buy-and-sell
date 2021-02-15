const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();
const server = require('../server');
const api = 'http://localhost:3000';
const createdUserSuccessfullySchema = require('../schemas/testSchemas/createdUserSuccessfullySchema.json');
const userLoginSchema = require('../schemas/testSchemas/userLoginSchema.json');
const errorResponseSchema = require('../schemas/testSchemas/errorResponseSchema.json');

createTestUser = () => {
  return chai
    .request(api)
    .post('/users/signup')
    .set('Content-Type', 'application/json')
    .send({
      email: 'tarkin@deathstar.com',
      username: 'tarkin',
      password: 'password',
      name: {
        firstname: 'Grand Moff',
        lastname: 'Tarkin',
      },
      address: {
        street: 'kurkelankangas 6',
        number: 'B10',
        postcode: '90210',
        city: 'Oulu',
        country: 'Finland',
      },
      phone: '358859237999',
    });
};

describe('HTTP User Routes', function () {
  before(async function () {
    server.start();
  });

  after(async function () {
    server.close();
  });

  /**
   * Test Signup the POST route /users/signup
   */
  describe('Create new user', () => {
    it('Should Register a new user to the system', () => {
      createTestUser()
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
          expect(response.body).to.be.jsonSchema(createdUserSuccessfullySchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail if email exists', () => {
      chai
        .request(api)
        .post('/users/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: 'tarkin@deathstar.com',
          username: 'tarkin',
          password: 'somepassword',
          name: {
            firstname: 'somename',
            lastname: 'nolastname',
          },
          address: {
            street: 'address',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237777',
        })
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body).to.be.jsonSchema(errorResponseSchema);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should fail if username missing', () => {
      chai
        .request(api)
        .post('/users/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: 'trooper@deathstar.com',
          password: 'somepassword',
          name: {
            firstname: 'somename',
            lastname: 'nolastname',
          },
          address: {
            street: 'address',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237777',
        })
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body).to.be.jsonSchema(errorResponseSchema);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should fail if password missing', () => {
      chai
        .request(api)
        .post('/users/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: 'trooper@deathstar.com',
          username: 'trooper',
          name: {
            firstname: 'somename',
            lastname: 'nolastname',
          },
          address: {
            street: 'address',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237777',
        })
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body).to.be.jsonSchema(errorResponseSchema);
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('Login', function () {
    it('Should login successfully', () => {
      chai
        .request(api)
        .post('/users/login')
        .auth('tarkin', 'password')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.be.jsonSchema(userLoginSchema);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should reject(status 401) the request if fields are missing or empty', async function () {
      await chai
        .request(api)
        .post('/users/login')
        .send({
          username: 'anakin',
        })
        .then((response) => {
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
      await chai
        .request(api)
        .post('/users/login')
        .send({
          password: 'password',
        })
        .then((response) => {
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
      await chai
        .request(api)
        .post('/users/login')
        .send({
          username: '',
          password: 'password',
        })
        .then((response) => {
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
      await chai
        .request(api)
        .post('/users/login')
        .send({
          username: 'anakin',
          password: '',
        })
        .then((response) => {
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should reject(status 401) the request password is incorrect', async function () {
      await chai
        .request(api)
        .post('/users/login')
        .send({
          username: 'anakin',
          password: 'pass',
        })
        .then((response) => {
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should not login with incorrect username', () => {
      chai.request(api)
        .get('/users/login')
        .auth('ThisUserNameShouldNotExist', 'SomePassword')
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
        })
        .catch(error => {
          throw error;
        });
    });
  });
});
