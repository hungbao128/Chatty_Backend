const dotenv = require("dotenv");
dotenv.config({});

class EnvConfig {
  NODE_ENV;
  MONGODB_URL;
  ACCESS_TOKEN_SECRET;
  ACCESS_TOKEN_EXPIRES_IN;
  REFRESH_TOKEN_SECRET;
  REFRESH_TOKEN_EXPIRES_IN;
  AWS_REGION;
  AWS_ACCESS_KEY_ID;
  AWS_ACCESS_SECRET_KEY;
  AWS_SES_FROM_ADDRESS;

  isProduction() {
    return process.env.NODE_ENV === "production";
  }

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.MONGODB_URL = process.env.MONGODB_URL;
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    this.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
    this.AWS_REGION = process.env.AWS_REGION;
    this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    this.AWS_ACCESS_SECRET_KEY = process.env.AWS_ACCESS_SECRET_KEY;
    this.AWS_SES_FROM_ADDRESS = process.env.AWS_SES_FROM_ADDRESS;
  }
}

module.exports = new EnvConfig();
