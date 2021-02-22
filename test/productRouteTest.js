const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const testProductSchema = require('../schemas/testSchemas/testProductSchema.json');
const server = require('../server');
const jsonwebtoken = require('jsonwebtoken');
const api = 'http://localhost:3000';

process.env.NODE_ENV = 'test';

createProductTestUser = () => {
  return chai
    .request(api)
    .post('/users/signup')
    .set('Content-Type', 'application/json')
    .send({
      email: 'kenobi@jedi.com',
      username: 'kenobi',
      password: 'password',
      name: {
        firstname: 'Obi Wan',
        lastname: 'Kenobi',
      },
      address: {
        street: 'Kuhatie 1',
        number: 'B10',
        postcode: '90210',
        city: 'Oulu',
        country: 'Finland',
      },
      phone: '358859237888',
    });
};

describe('Product Routes', function () {
  before(async function () {
    server.start();
  });

  after(async function () {
    server.close();
  });

  describe('Register User To Access Products', () => {
    it('Should Register a new user to the system', () => {
      createProductTestUser()
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
          expect(response.body).to.be.jsonSchema(createdUserSuccessfullySchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });

  describe('Create Product', () => {
    let token = null;
    let decodedJwt = null;
    before(async function () {
      await chai
        .request(api)
        .post('/users/login')
        .auth('kenobi', 'password')
        .then((response) => {
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });
    it('Should return 201 and create new product with image uploads', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Chair')
        .field('description', 'A black chair. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 201 and create new product with multiple image uploads', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Orangutan-Jungle-School-1.jpg`),
          'test/images/Orangutan-Jungle-School-1.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/silicon-valley-jokes.jpg`),
          'test/images/silicon-valley-jokes.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Morty.png`),
          'test/images/Morty.png'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return status 400 if category missing', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Chair')
        .field('description', 'A black chair. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Orangutan-Jungle-School-1.jpg`),
          'test/images/Orangutan-Jungle-School-1.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/silicon-valley-jokes.jpg`),
          'test/images/silicon-valley-jokes.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Morty.png`),
          'test/images/Morty.png'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return status 400 if category incorrect', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Chair')
        .field('description', 'A black chair. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Liv')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Orangutan-Jungle-School-1.jpg`),
          'test/images/Orangutan-Jungle-School-1.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/silicon-valley-jokes.jpg`),
          'test/images/silicon-valley-jokes.jpg'
        )
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/Morty.png`),
          'test/images/Morty.png'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body.msg).to.equal(
            "Category doesn't exist see list Fashion,Home & Living,Hobbies,Kids,Classes,Properties,Vehicles,Services,Mobile Phones,Pets,Electronics,Machinery,Jobs"
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return status 400 if no image files attached', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Chair')
        .field('description', 'A black chair. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body.error).to.equal('No images attached');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return status 401 if not authorized', async () => {
      await chai
        .request(api)
        .post('/products')
        .set('content-type', 'multipart/form-data')
        .field('title', 'Chair')
        .field('description', 'A black chair. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
          expect(response.text).to.equal('Unauthorized');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });

  describe('GET All Products', () => {
    it('Should get all products in system', async () => {
      await chai
        .request(api)
        .get('/products')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should get products filtered by query parameter (city) ', async () => {
      await chai
        .request(api)
        .get('/products?city=nurmes')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
          expect(response.body.products[0].city).to.equal('Nurmes');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should get products filtered by query parameter (country) ', async () => {
      await chai
        .request(api)
        .get('/products?country=finland')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
          expect(response.body.products[0].country).to.equal('Finland');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should get products filtered by query parameter (startDate) ', async () => {
      await chai
        .request(api)
        .get('/products?startDate=2021-02-21')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should get products filtered by query parameter (startDate & endDate) ', async () => {
      await chai
        .request(api)
        .get('/products?startDate=2021-02-21&endDate=2021-02-21')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should get products filtered by query parameter (category) ', async () => {
      await chai
        .request(api)
        .get('/products?category=home&living')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.products[0]).to.be.jsonSchema(testProductSchema);
          expect(response.body.products[0].category).to.equal('Home & Living');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail to get products filtered by wrong query parameter (category) ', async () => {
      await chai
        .request(api)
        .get('/products?category=gre')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail to get products filtered by wrong query parameter (startDate & endDate) ', async () => {
      await chai
        .request(api)
        .get('/products?startDate=2021-03-10&endDate=2021-04-20')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal(
            'No products from 2021-03-10 & 2021-04-20.'
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail to get products filtered by wrong query parameter (startDate) ', async () => {
      await chai
        .request(api)
        .get('/products?startDate=2021-03-10')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal('No products from 2021-03-10.');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail to get products filtered by wrong query parameter (country) ', async () => {
      await chai
        .request(api)
        .get('/products?country=sweden')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal('No products from sweden.');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail to get products filtered by wrong query parameter (city) ', async () => {
      await chai
        .request(api)
        .get('/products?city=dublin')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal('No products from dublin.');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });

  describe('Get product with ID', () => {
    it('Should get a single product in system', async () => {
      const id = 5;
      await chai
        .request(api)
        .get(`/products/${id}`)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.result).to.be.jsonSchema(testProductSchema);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should fail if no product in system', async () => {
      const id = 115;
      await chai
        .request(api)
        .get(`/products/${id}`)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal(
            'The product with provided ID does not exist!'
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });

  describe('Edit Product with ID', async () => {
    let token = null;
    let decodedJwt = null;
    before(async () => {
      await chai
        .request(api)
        .post('/users/login')
        .auth('kenobi', 'password')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('token');
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });
    it('Should update a single product in system', async () => {
      const id = 5;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'Table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Oulu')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
          expect(response.body.product.title).to.equal('Table');
          expect(response.body.product.description).to.equal(
            'A black table. Good condition.'
          );
          expect(response.body.product.city).to.equal('Oulu');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 401 if not authorized', async () => {
      const id = 5;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('content-type', 'multipart/form-data')
        .field('title', 'table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
          expect(response.text).to.equal('Unauthorized');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 404 if provided ID does not exist', async () => {
      const id = 111;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal(
            'The product with provided ID does not exist!'
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 400 if category is incorrect', async () => {
      const id = 5;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'clown')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 400 if category is missing', async () => {
      const id = 5;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .attach(
          'images',
          fs.readFileSync(`${__dirname}/images/file.jpg`),
          'test/images/file.jpg'
        )
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.text).to.equal(
            `["should have required property 'category'"]`
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return status 400 if no image files attached', async () => {
      const id = 5;
      await chai
        .request(api)
        .put(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .set('content-type', 'multipart/form-data')
        .field('title', 'table')
        .field('description', 'A black table. Good condition.')
        .field('city', 'Nurmes')
        .field('country', 'Finland')
        .field('price', '29.99')
        .field('shipping', 'false')
        .field('category', 'Home & Living')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(400);
          expect(response.body.error).to.equal('No images attached');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });

  describe('Delete Product with ID', () => {
    let token = null;
    let decodedJwt = null;
    beforeEach(async () => {
      await chai
        .request(api)
        .post('/users/login')
        .auth('kenobi', 'password')
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('token');
          token = response.body.token;
          decodedJwt = jsonwebtoken.decode(token, { complete: true });
        });
    });
    it('Should return 401 if not authorized', async () => {
      const id = 11;
      await chai
        .request(api)
        .delete(`/products/${id}`)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(401);
          expect(response.text).to.equal('Unauthorized');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should return 404 if provided ID does not exist', async () => {
      const id = 111;
      await chai
        .request(api)
        .delete(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal(
            'The product with provided ID does not exist!'
          );
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
    it('Should delete a single product from the system', async () => {
      const id = 12;
      await chai
        .request(api)
        .delete(`/products/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .then((response) => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body.msg).to.equal('Product Deleted.');
        })
        .catch((error) => {
          assert.fail(error);
        });
    });
  });
});
