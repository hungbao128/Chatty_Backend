const { Sequelize } = require("sequelize");
const EnvConfig = require("./../envConfig");

class MysqlConnection {
  static instace = null;
  #sequelize;

  constructor() {
    this.#connect();
  }

  #connect() {
    this.#sequelize = new Sequelize(
      EnvConfig.MYSQL_DB,
      EnvConfig.MYSQL_USERNAME,
      EnvConfig.MYSQL_PASSWORD,
      {
        host: EnvConfig.MYSQL_HOST,
        dialect: "mysql",
      }
    );

    this.#sequelize
      .authenticate()
      .then(() => {
        console.log("MySQL connected");
      })
      .catch((error) => {
        console.log("Error connecting to MySQL", error);
      });
  }

  static getInstance() {
    if (!this.instace) {
      this.instace = new MysqlConnection();
    }

    return this.instace;
  }

  getSequelize() {
    return this.#sequelize;
  }
}

const sequelize = MysqlConnection.getInstance().getSequelize();

module.exports = { MysqlConnection, sequelize };
