const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const allProductsSchema = require('../schemas/testSchemas/allProductsSchema.json');
const server = require('../server');
const jsonwebtoken = require('jsonwebtoken');
const api = 'http://localhost:3000';

describe('HTTP Product Routes', function () {
  let token = null;
  let decodedJwt = null;

  before(async function () {
    server.start();

    // await chai
    //   .request(api)
    //   .get('users/login')
    //   .auth('anakin', 'password')
    //   .then((response) => {
    //     token = response.body.jwt;
    //     console.log(response.body.jwt);
    //     decodedJwt = jsonwebtoken.decode(userJwt, { complete: true });
    //   });
  });

  after(async function () {
    server.close();
  });

  /**
   * Test the GET route /products
   * Test all products in system
   */
  describe('GET all products from URL /products', () => {
    it('Should get all products in system', (done) => {
      chai
        .request(api)
        .get('/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('Expect Product to be formed in this order', async function () {
      await chai
        .request(api)
        .get('/products')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(allProductsSchema);
          expect(response.body.products).to.have.lengthOf(3);
          expect(response.body.products[0].title).to.equal('Asus Laptop');
          expect(response.body.products[0].description).to.equal(
            "its working perfect in good condition the enter key don't work and there is no mouse coming with it and it can be used as tablet as well"
          );
          expect(response.body.products[0].city).to.equal('Oulu');
          expect(response.body.products[0].country).to.equal('Finland');
          expect(response.body.products[0].images).to.be.an('array');
          expect(response.body.products[0].price).to.be.a('number');
          expect(response.body.products[0].shipping).to.equal(false);
          expect(response.body.products[0].pickup).to.equal(true);
          expect(response.body.products[0].createDate).to.equal('2021-01-10');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });

    /**
     * Test the GET (by id) /products/:productId
     * Test a single product by id
     */
    it('Should get a single product in system', (done) => {
      const id = 1;
      chai
        .request(api)
        .get(`/products/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('Should not get a single product in system', (done) => {
      const id = 5;
      chai
        .request(api)
        .get(`/products/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  // TODO: test GET products with query params

  /**
   * Test the PUT (by id) /products/:productId
   */

  /**
   * Test the DELETE (by id) /products/:productId
   */

  /**
   * Test the POST route /products
   */
  // describe('Create a new product', function () {
  //   it('Should create a new product', async function () {
  //     await (await chai.request(api).post('/products'))
  //       .set({ Authorization: `Bearer ${token}` })
  //       .send({
  //         title: 'Boat',
  //         description: 'Old boat. Ok condition',
  //         city: 'Joensuu',
  //         country: 'Finland',
  //         images: [{ originalname: 'mando.jpg' }],
  //         price: 10.5,
  //         shipping: true,
  //         pickup: false,
  //         userId: 'e15c636e-9c72-4f3b-99fe-c72876c186f6',
  //         user: {
  //           name: {
  //             firstname: 'Anakin',
  //             lastname: 'Skywalker',
  //           },
  //           email: 'anakin@jedi.com',
  //           phone: '358859237845',
  //         },
  //         category: 'Vahicles',
  //         categoryId: 7,
  //         createDate: '2021-02-14',
  //       })
  //       .then((response) => {
  //         expect(response).to.have.property('status');
  //         expect(response.status).to.equal(201);
  //       });
  //   });
  // });
});
