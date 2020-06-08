const request = require('supertest');
const { expect } = require('chai');

const server = require('../../server');
const Database = require('../utils/database');
const UserUtils = require('../utils/user');


describe('List User route', () => {

  context('when executing a GET to /users without any previous records', () => {
    before(async () => {
      await Database.clear();
    });

    it('should return status 200 and an empty list', async () => {
      const response = await request(server).get('/users').send();
      expect(response.status).to.be.equals(200);
      expect(response.body).to.be.a('array').that.is.empty;
    });
  });

  context(`when executing a GET to /users having some previous records`, () => {
    let users;
    before(async () => {
      await Database.clear();
      users = await UserUtils.createSeveralUsers();
    });

    it(`should return status 200 and a list containing all users`, async () => {
      const response = await request(server).get('/users').send();
      expect(response.status).to.be.equals(200);
      expect(response.body).to.have.lengthOf(users.length);
    });
  });

});