const { MongoClient } = require('mongodb');
const DBName = process.env.DBNAME;

class Database {
  async init() {
    const client = await MongoClient.connect('mongodb://localhost');
    this.db = client.db(DBName);
  }
}

module.exports = new Database();