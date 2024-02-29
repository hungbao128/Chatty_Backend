const {Server} = require('socket.io');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const {createServer} = require('http');
const MongoDBConnection = require('./databases/mongodb.init');
const { isProdction } = require('./envConfig');

const SERVER_PORT = 8555;

class ApplicationServer {
  constructor(app) {
    this.app = app;
  }

  start() {
    this.#initalizeFolderUpload();
    this.#connectDatabase();
    this.#standardMiddleware(this.app);
    this.#routes(this.app);
    this.#globalErrorHandling(this.app);
    this.#startServer(this.app);
  }
    #initalizeFolderUpload(){
      if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    }

    #connectDatabase(){
        MongoDBConnection.getInstance();
    }

  #standardMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
  }

  #routes(app) {
    app.use("/api/v1", require("./routes"));
    
    app.use("*", (req, res, next) => {
      res.status(404).json({
        message: "Route not found",
      });
    });
  }

  #createSocketIoServer(httpServer) {
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    
    return io;
  }

  #globalErrorHandling(app) {
    app.use((error, req, res, next) => {
      const statusCode = error.statusCode || 500;
      const status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      let message = error.message || "Internal server error";
      let stack = error.stack;

      if(isProdction){
        stack = undefined;
        statusCode === 500 ? message = "Internal server error" : message;
      }
      
      res.status(statusCode).json({
        status,
        message,
        stack
      });
    });
  }

  #startServer(app) {
    const httpServer = createServer(app);
    const io = this.#createSocketIoServer(httpServer);

    httpServer.listen(SERVER_PORT, () => {
      console.log("Server listening on port " + SERVER_PORT);
    });
  }
}

module.exports = ApplicationServer;
