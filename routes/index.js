const express = require('express');
const router = express.Router();

const userRoutes = require('./user');

router.get('/', (request, response) => {
  response.send('Nothing here...');
});

router.use('/users', userRoutes);

module.exports = router;