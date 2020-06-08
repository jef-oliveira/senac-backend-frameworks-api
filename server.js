const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const Database = require('./commons/database');
const ErrorMiddleware = require('./middlewares/errorHandler');
const routes = require('./routes');

const server = express();

/*
server.param('id', (request, response, next, id) => {
  request.params.id = ObjectID(id);
  console.log('parsed :id to', request.params.id)
  next();
});
*/

Database.init();

server.use(bodyParser.json());
server.use(routes);
server.use(ErrorMiddleware);

module.exports = server;