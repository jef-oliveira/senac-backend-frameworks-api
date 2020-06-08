const request = require('supertest');
const { expect } = require('chai');

const server = require('../../server');
const Database = require('../utils/database');
const UserUtils = require('../utils/user');


const expectFail = async (originalData, property, faultyValue) => {
  const updatedData = UserUtils.updatedData(originalData);
  const id = originalData._id.toString();
  updatedData[property] = faultyValue;

  const response = await request(server).put(`/users/${id}`).send(updatedData).set('Accept', 'application/json');
  expect(response.status).to.be.equals(400);
  expect(response.body).to.have.property('message');
  expect(response.body.message).to.be.a('string').that.includes(`"${property}"`);
};

describe('Update User route', () => {

  context('when executing a PUT to /users/:id without any previous records', () => {
    it('should return status 404', async () => {
      const data = UserUtils.updatedData();

      const response = await request(server).put(`/users/${UserUtils.invalidId()}`).send(data).set('Accept', 'application/json');
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a PUT to /users/:id and the id does not exists', () => {
    before(async () => {
      await Database.clear();
      await UserUtils.createSeveralUsers();
    });

    it('should return status 404', async () => {
      const data = UserUtils.updatedData();

      const response = await request(server).put(`/users/${UserUtils.invalidId()}`).send(data).set('Accept', 'application/json');
      expect(response.status).to.be.equals(404);
    });
  });

  context('when executing a PUT to /users/:id and the id does exists', () => {
    let originalData;

    beforeEach(async () => {
      await Database.clear();
      const users = await UserUtils.createSeveralUsers();
      originalData = UserUtils.pickOne(users);
    });

    context('with valid data', () => {
      it('should return status 200 and all data from the updated user', async () => {
        const updatedData = UserUtils.updatedData(originalData);
        const id = originalData._id.toString();

        const response = await request(server).put(`/users/${id}`).send(updatedData).set('Accept', 'application/json');
        expect(response.status).to.be.equals(200);
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.be.a('string');
        expect(response.body._id).to.be.equals(id);
        expect(response.body).to.have.property('name');
        expect(response.body.name).to.be.a('string');
        expect(response.body.name).to.be.not.equals(originalData.name);
        expect(response.body.name).to.be.equals(updatedData.name);
        expect(response.body).to.have.property('email');
        expect(response.body.email).to.be.a('string');
        expect(response.body.email).to.be.not.equals(originalData.email);
        expect(response.body.email).to.be.equals(updatedData.email);
      });
    });

    context('without a name or with a short name', () => {
      it('should return status 400 and a message about "name" errors', async () => {
        await expectFail(originalData, 'name');
        await expectFail(originalData, 'name', '...');
      });
    });

    context('without an e-mail or with a malformed e-mail adress', () => {
      it('should return status 400 and a message about "email" errors', async () => {
        await expectFail(originalData, 'email');
        await expectFail(originalData, 'email', 'malformed');
      });
    });
  });

});