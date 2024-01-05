const dotenv = require("dotenv");
dotenv.config({});

class EnvConfig {
  MONGODB_URL;
  ACCESS_TOKEN_SECRET;
  ACCESS_TOKEN_EXPIRES_IN;
  REFRESH_TOKEN_SECRET;
  REFRESH_TOKEN_EXPIRES_IN;

  isProdction() {
    return process.env.NODE_ENV === "production";
  }

  constructor() {
    this.MONGODB_URL = process.env.MONGODB_URL;
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    this.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
  }
}

module.exports = new EnvConfig();
