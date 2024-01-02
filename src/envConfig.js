const dotenv = require("dotenv");
dotenv.config({});

class EnvConfig {
  MONGODB_URL;

  isProdction() {
    return process.env.NODE_ENV === "production";
  }

  constructor() {
    this.MONGODB_URL = process.env.MONGODB_URL;
  }
}

module.exports = new EnvConfig();
