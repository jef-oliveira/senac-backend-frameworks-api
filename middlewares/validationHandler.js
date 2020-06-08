const validationHandler = (schema) => {
  return (request, response, next) => {
    const { _id, ...modelProps } = request.body;
    const { error, value } = schema.validate(modelProps, { allowUnknown: true });

    if (error) {
      response.status(400);
      throw new Error(error.message);
    }

    request.body = modelProps;

    return next();
  };
};

module.exports = validationHandler;