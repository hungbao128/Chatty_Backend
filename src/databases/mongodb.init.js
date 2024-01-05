const mongoose = require("mongoose");
const EnvConfig = require("./../envConfig");

class MongoDBConnection {
  static #instance;

  constructor() {
    this.#connect();
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoDBConnection();
    }

    return this.#instance;
  }

  #connect() {
    mongoose
      .connect(EnvConfig.MONGODB_URL, {})
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB", error);
      });

      if(!EnvConfig.isProdction()){
        mongoose.set('debug', true);
      }
  }
}

module.exports = MongoDBConnection;
