const Database = require('./database');
const { ObjectId } = require("mongodb");

class Collection {
  constructor(name) {
    this.name = name;
  }

  get collection() {
    return Database.db.collection(this.name);
  }

  async list () {
    return await this.collection.find({}).toArray();
  }

  async create (data) {
    const { insertedId } = await this.collection.insertOne(data);
    if (insertedId)
      return  await this.collection.findOne({ _id: ObjectId(insertedId) });

    return doc;
  }

  async find (id) {
    return await this.collection.findOne({ _id: ObjectId(id) });
  }

  async update (id, data) {
    const { modifiedCount } = await this.collection.updateOne({ _id: ObjectId(id) }, [{ $set: data }]);
    if (modifiedCount)
      return await this.collection.findOne({ _id: ObjectId(id) });

    return;
  }

  async delete (id) {
    const doc = await this.collection.findOne({ _id: ObjectId(id) });
    const { deletedCount } = await this.collection.deleteOne({ _id: ObjectId(id) });
    if (deletedCount)
      return doc;

    return;
  }

}

module.exports = Collection;