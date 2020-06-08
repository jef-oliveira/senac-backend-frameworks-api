const request = require('supertest');
const { expect } = require('chai');

const server = require('../../server');
const Database = require('../utils/database');
const UserUtils = require('../utils/user');


describe('Find User route', () => {

  context('when executing a GET to /users/:id without any previous records', () => {
    it('should return status 404', async () => {
      const response = await request(server).get(`/users/${UserUtils.invalidId()}`).send();
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a GET to /users/:id and the id does not exists', () => {
    before(async () => {
      await Database.clear();
      await UserUtils.createSeveralUsers();
    });

    it('should return status 404', async () => {
      const response = await request(server).get(`/users/${UserUtils.invalidId()}`).send();
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a GET to /users/:id and the id does exists', () => {
    let users;
    before(async () => {
      await Database.clear();
      users = await UserUtils.createSeveralUsers();
    });


    it('should return status 200 and the correct user data', async () => {
      const user = UserUtils.pickOne(users);
      const id = user._id.toString();

      const response = await request(server).get(`/users/${id}`).send();
      expect(response.status).to.be.equals(200);
      expect(response.body).to.have.property('_id');
      expect(response.body._id).to.be.a('string');
      expect(response.body._id).to.be.equals(id);
      expect(response.body).to.have.property('name');
      expect(response.body.name).to.be.a('string');
      expect(response.body.name).to.be.equals(user.name);
      expect(response.body).to.have.property('email');
      expect(response.body.email).to.be.a('string');
      expect(response.body.email).to.be.equals(user.email);
    });
  });

});