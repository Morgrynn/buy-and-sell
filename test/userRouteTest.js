const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const expect = require('chai').expect;
const assert = require('chai').assert;
const server = require('../server');
const api = 'http://localhost:3000';
const jsonwebtoken = require('jsonwebtoken');
const createdUserSuccessfullySchema = require('../schemas/testSchemas/createdUserSuccessfullySchema.json');
const userLoginSchema = require('../schemas/testSchemas/userLoginSchema.json');
const errorResponseSchema = require('../schemas/testSchemas/errorResponseSchema.json');

process.env.NODE_ENV = 'test';

createTestUser = () => {
  return chai
    .request(api)
    .post('/users/signup')
    .set('Content-Type', 'application/json')
    .send({
      email: 'anakin@jedi.com',
      username: 'anakin',
      password: 'password',
      name: {
        firstname: 'Anakin',
        lastname: 'Skywalker',
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

describe('User Routes', function () {
  before(async function () {
    server.start();
  });

  after(async function () {
    server.close();
  });

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
          email: 'anakin@jedi.com',
          username: 'anakin',
          password: 'password',
          name: {
            firstname: 'Anakin',
            lastname: 'Skywalker',
          },
          address: {
            street: 'kurkelankangas 6',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237999',
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
          email: 'anakin@jedi.com',
          password: 'password',
          name: {
            firstname: 'Anakin',
            lastname: 'Skywalker',
          },
          address: {
            street: 'kurkelankangas 6',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237999',
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
          email: 'anakin@jedi.com',
          username: 'anakin',
          name: {
            firstname: 'Anakin',
            lastname: 'Skywalker',
          },
          address: {
            street: 'kurkelankangas 6',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859237999',
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
        .auth('anakin', 'password')
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
      chai
        .request(api)
        .get('/users/login')
        .auth('ThisUserNameShouldNotExist', 'password')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should not login without auth information', () => {
      chai
        .request(api)
        .get('/users/login')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('Get User', () => {
    let token = null;
    let decodedJwt = null;
    before(async function () {
      await chai
        .request(api)
        .post('/users/login')
        .auth('anakin', 'password')
        .then((response) => {
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });

    it('Should get user info', (done) => {
      chai
        .request(api)
        .get(`/users/${decodedJwt.payload.user.id}`)
        .set('Authorization', 'Bearer ' + token)
        .end((err, response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.user).to.have.property('userid');
          expect(response.body.user.userid).to.equal(
            `${decodedJwt.payload.user.id}`
          );
          done();
        });
    });
    it('Should fail to get user info', (done) => {
      chai
        .request(api)
        .get('/users')
        .end((err, response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          done();
        });
    });
  });

  describe('Edit user', () => {
    let token = null;
    let decodedJwt = null;
    before(async function () {
      await chai
        .request(api)
        .post('/users/login')
        .auth('anakin', 'password')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });

    it('Should edit user info', async () => {
      await chai
        .request(api)
        .put(`/users/${decodedJwt.payload.user.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          username: 'Vader',
          password: 'newpassword',
          name: {
            firstname: 'Darth',
            lastname: 'Vader',
          },
          address: {
            street: 'Death Star',
            number: 'B10',
            postcode: '90210',
            city: 'Oulu',
            country: 'Finland',
          },
          phone: '358859888999',
        })
        .then((modifyResponse) => {
          expect(modifyResponse).to.have.property('status');
          expect(modifyResponse.status).to.equal(201);
          return chai
            .request(api)
            .get(`/users/${decodedJwt.payload.user.id}`)
            .set('Authorization', 'Bearer ' + token);
        })
        .then((readResponse) => {
          expect(readResponse).to.have.property('status');
          expect(readResponse.status).to.equal(200);
          expect(readResponse.body.user).to.have.property('userid');
          expect(readResponse.body.user.userid).to.equal(
            `${decodedJwt.payload.user.id}`
          );
          expect(readResponse.body.user).to.have.property('email');
          expect(readResponse.body.user.email).to.equal('anakin@jedi.com');
          expect(readResponse.body.user).to.have.property('username');
          expect(readResponse.body.user.username).to.equal('Vader');
          expect(readResponse.body.user)
            .to.an('object')
            .that.does.not.have.property('password');
          expect(readResponse.body.user.firstname).to.have.equal('Darth');
          expect(readResponse.body.user.lastname).to.have.equal('Vader');
        })
        .catch((error) => {
          throw error;
        });
    });
    it('Should fail to edit user info', async () => {
      await chai
        .request(api)
        .put(`/users/${decodedJwt.payload.user.id}`)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('Delete user', () => {
    let token = null;
    let decodedJwt = null;
    before(async function () {
      await chai
        .request(api)
        .post('/users/login')
        .auth('Vader', 'newpassword')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('token');
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });

    it('Should delete user', async () => {
      await chai
        .request(api)
        .delete(`/users/${decodedJwt.payload.user.id}`)
        .set('Authorization', 'Bearer ' + token)
        .then((deleteResponse) => {
          expect(deleteResponse).to.have.property('status');
          expect(deleteResponse.status).to.equal(200);

          return chai
            .request(api)
            .post('/users/login')
            .auth('Vader', 'newpassword');
        })
        .then((newLoginResponse) => {
          expect(newLoginResponse).to.have.property('status');
          expect(newLoginResponse.status).to.equal(401);
          // Create the test user back again
          // return createTestUser();
        })
        // .then((createUserResponse) => {
        //   expect(createUserResponse).to.have.property('status');
        //   expect(createUserResponse.status).to.equal(201);
        // })
        .catch((error) => {
          throw error;
        });
    });
    it('Should fail to delete user info', (done) => {
      chai
        .request(api)
        .delete(`/users/${decodedJwt.payload.user.id}`)
        .end((err, response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
          done();
        });
    });
  });
});
