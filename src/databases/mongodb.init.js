const mongoose = require('mongoose');


class MongoDBConnection{
    static #instance;

    constructor(){
        this.#connect();
    }

    static getInstance(){
        if(!this.#instance){
            this.#instance = new MongoDBConnection();
        }

        return this.#instance;
    }

    #connect(){
        mongoose.connect('mongodb+srv://dmcm10:ddryhqwert1@cluster0.5oqxf7n.mongodb.net/chatty?retryWrites=true&w=majority', {  
        })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB", error);
        })
    }
}

module.exports = MongoDBConnection;