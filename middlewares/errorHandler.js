const handler = (error, request, response, next) => {
  response.send({ message: error.message });
};

module.exports = handler;