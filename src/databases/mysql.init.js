const { Sequelize } = require("sequelize");

class MysqlConnection{
    static instace = null;
    #sequelize;

    constructor(){
        this.#connect();
    }

    #connect(){
         this.#sequelize = new Sequelize('chatty', 'root', 'root', {
            host: 'localhost',
            dialect: 'mysql'
        });


        this.#sequelize.authenticate()
            .then(() => {
                console.log('MySQL connected');
            })
            .catch((error) => {
                console.log("Error connecting to MySQL", error);
            })
    }

    static getInstance(){
        if(!this.instace){
            this.instace = new MysqlConnection();
        }

        return this.instace;
    }

    getSequelize(){
        return this.#sequelize;
    }
}

module.exports = MysqlConnection;
module.sequelize = MysqlConnection.getInstance().getSequelize();