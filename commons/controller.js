const Database = require('./database');
const { ObjectId } = require("mongodb");

class Controller {
  constructor(model) {
    this.model = model;
    
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async list (request, response) {
    const resultList = await this.model.list({});
    return response.send(resultList);
  }

  async create (request, response) {
    const result = await this.model.create(request.body);
    return response.send(result);
  }

  async find (request, response) {
    const { id } = request.params;
    const result = await this.model.find(id);
    if (!result)
      return response.status(404).send();

    return response.send(result);
  }

  async update (request, response) {
    const { id } = request.params;
    const result = await this.model.update(id, request.body);
    if (!result)
      return response.status(404).send();

    response.send(result);
  }

  async delete (request, response) {
    const { id } = request.params;
    const result = await this.model.delete(id);
    if (!result)
      return response.status(404).send();

    return response.send(result);
  }

}

module.exports = Controller;