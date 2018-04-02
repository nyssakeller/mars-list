const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
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

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/items_to_pack', () => {

    it('should return all of the items to be packed', () => {
      return chai.request(server)
      .get('/api/v1/items_to_pack')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('item_name');
        response.body[0].item_name.should.equal('Oxygen Tank');
        response.body[0].should.have.property('packed_status');
        response.body[0].packed_status.should.equal('false');
      })
      .catch(err => {
        throw err;
      });
    });

    describe('POST /api/v1/items_to_pack', () => {
      it('should create a new item', () => {
        return chai.request(server)
        .post('/api/v1/items_to_pack') 
        .send({                   
          item_name: 'Water',
          packed_status: false
        })
        .then(response => {
          response.should.have.status(201); 
          response.body.should.be.a('object');
          response.body.should.have.property('item_name');
          response.body.item_name.should.equal('Water');
          response.body.should.have.property('packed_status');
          response.body.packed_status.should.equal('false');
        })
        .catch(err => {
          throw err;
        });
      });
    });

    it('should not create a item with missing data', () => {
      return chai.request(server)
      .post('/api/v1/items_to_pack')
      .send()
      .then(response => {
        response.should.have.status(422);
      })
      .catch(err => {
        throw err;
      });
    });

  });

  describe('DELETE /api/v1/items_to_pack/:id/', () => {
    it('should delete an item when given the correct id', () => {
      return chai.request(server)
        .delete(`/api/v1/items_to_pack/1`)
        .then( response => {
          response.status.should.equal(204);
        })
        .catch( error => {
          throw error;
        });
    });

    it.skip('should return a 404 if no item matches', () => {
      return chai.request(server)
        .delete('/api/v1/items_to_pack/999')
        .then( response => {
          response.should.have.status(404);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('PATCH api/v1/items_to_pack/:id', () => {
    it.skip('should update the packed_status', () => {
      return chai
        .request(server)
        .patch('/api/v1/items_to_pack/5')
        .send({
          packed_status: 'true'
        })
        .then(response => {
          response.should.have.status(201);
        });
    });
  });

});