const Database = require('../../commons/database');

const clear = () => {
  return Database.db.dropDatabase();
};

module.exports = {
  clear
};