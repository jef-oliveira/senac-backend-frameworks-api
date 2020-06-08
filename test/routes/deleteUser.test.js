const request = require('supertest');
const { expect } = require('chai');

const server = require('../../server');
const Database = require('../utils/database');
const UserUtils = require('../utils/user');


describe('Delete User route', () => {

  context('when executing a DELETE to /users/:id without any previous records', () => {
    it('should return status 404', async () => {
      const response = await request(server).delete(`/users/${UserUtils.invalidId()}`);
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a DELETE to /users/:id and the id does not exists', () => {
    before(async () => {
      await Database.clear();
      await UserUtils.createSeveralUsers();
    });

    it('should return status 404', async () => {
      const response = await request(server).delete(`/users/${UserUtils.invalidId()}`);
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a DELETE to /users/:id and the id does exists', () => {
    let deletedUser, id;

    before(async () => {
      await Database.clear();
      const users = await UserUtils.createSeveralUsers();
      deletedUser = UserUtils.pickOne(users);
      id = deletedUser._id.toString();
    });

    it('should return status 200 and all data from the deleted user', async () => {
      const response = await request(server).delete(`/users/${id}`);
      expect(response.status).to.be.equals(200);
      expect(response.body).to.have.property('_id');
      expect(response.body._id).to.be.a('string');
      expect(response.body._id).to.be.equals(id);
      expect(response.body).to.have.property('name');
      expect(response.body.name).to.be.a('string');
      expect(response.body.name).to.be.equals(deletedUser.name);
      expect(response.body).to.have.property('email');
      expect(response.body.email).to.be.a('string');
      expect(response.body.email).to.be.equals(deletedUser.email);
    });

    it('should return status 404 on subsequent find attempts', async () => {
      const response = await request(server).get(`/users/${id}`).send();
      expect(response.status).to.be.equals(404);
    });
  });

});