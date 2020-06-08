const request = require('supertest');
const { expect } = require('chai');

const server = require('../../server');
const Database = require('../utils/database');
const UserUtils = require('../utils/user');


const expectSuccess = (data) => {
  it('should return status 200 and all data from the created user ', async () => {
    const response = await request(server).post('/users').send(data).set('Accept', 'application/json');
    expect(response.status).to.be.equals(200);
    expect(response.body).to.have.property('_id');
    expect(response.body._id).to.be.a('string');
    expect(response.body).to.have.property('name');
    expect(response.body.name).to.be.a('string');
    expect(response.body.name).to.be.equals(data.name);
  });
};

const expectFail = (data, property) => {
  it(`should return status 400 and a message about "${property}" errors`, async () => {
    const response = await request(server).post('/users').send(data).set('Accept', 'application/json');
    expect(response.status).to.be.equals(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string').that.includes(`"${property}"`);
  });
};

describe('Create User route', () => {

  beforeEach(async () => {
    await Database.clear();
  });

  context('when executing a POST to /users with valid data', () => {
    const data = UserUtils.validData();
    expectSuccess(data);
  });

  context('when executing a POST to /users without a name', () => {
    const data = { ...UserUtils.validData(), name: undefined };
    expectFail(data, 'name');
  });

  context('when executing a POST to /users with a short name', () => {
    const data = { ...UserUtils.validData(), name: '...' };
    expectFail(data, 'name');
  });

  context('when executing a POST to /users without an e-mail', () => {
    const data = { ...UserUtils.validData(), email: undefined };
    expectFail(data, 'email');
  });

  context('when executing a POST to /users with a malformed e-mail adress', () => {
    const data = { ...UserUtils.validData(), email: 'malformed' };
    expectFail(data, 'email');
  });

  context('when executing a POST to /users without avatar', () => {
    const data = { ...UserUtils.validData(), avatar: undefined };
    expectSuccess(data);
  });

  context('when executing a POST to /users without any role', () => {
    const data = { ...UserUtils.validData(), roles: undefined };
    expectSuccess(data);
  });

});