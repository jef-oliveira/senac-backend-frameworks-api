const Collection = require('../commons/collection');

class User extends Collection {
  constructor() {
    super('users');
  }
}

module.exports = new User();