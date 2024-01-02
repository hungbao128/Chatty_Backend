const dotenv = require("dotenv");
dotenv.config({});

class EnvConfig {
  MONGODB_URL;
  MYSQL_DB;
  MYSQL_USERNAME;
  MYSQL_PASSWORD;
  MYSQL_HOST;

  isProdction() {
    return process.env.NODE_ENV === "production";
  }

  constructor() {
    this.MONGODB_URL = process.env.MONGODB_URL;
    this.MYSQL_DB = process.env.MYSQL_DB;
    this.MYSQL_USERNAME = process.env.MYSQL_USERNAME;
    this.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
    this.MYSQL_HOST = process.env.MYSQL_HOST;
  }
}

module.exports = new EnvConfig();
