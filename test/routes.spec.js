const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/nonexisting')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });

});