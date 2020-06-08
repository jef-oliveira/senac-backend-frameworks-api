const Joi = require('joi');
const Controller = require('../commons/controller');
const User = require('../models/user');

class UserController extends Controller {
  constructor() {
    super(User);
  }

  get createSchema () {
    return Joi.object({
      name: Joi.string().min(4).max(128).required()
               .error(new Error('"name" is required and must be between 4 and 128 characters long')),
      email: Joi.string().email().required()
                .error(new Error('"email" is required and must be a valid e-mail address')),
      password: Joi.string().min(4).max(42).required()
                   .error(new Error('"name" is required and must be between 4 and 32 characters long')),
      avatar: Joi.string().min(4).max(256).default('default.jpg'),
      roles: Joi.array().items(Joi.string().allow('admin', 'default')).optional()
    });
  }

  validate (request, response, next) {
    const { name, email, password, avatar, roles } = request.body;

    if (!name || name.length < 5)
      return response.status(400).send({ message: 'Name is required and must be at least 5 characters long' });
    if (!email)
      return response.status(400).send({ message: 'Email is required' });
    if (email && !email.includes('@'))
      return response.status(400).send({ message: 'Email must be valid' });
    if (!password || password.length < 4)
      return response.status(400).send({ message: 'Password is required and must be at least 4 characters long' });

    request.body = { name, email, password, avatar, roles };

    return next();
  }

}

module.exports = new UserController();