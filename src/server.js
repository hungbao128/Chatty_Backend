const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const MongoDBConnection = require("./databases/mongodb.init");
const { MysqlConnection } = require("./databases/mysql.init");

const SERVER_PORT = 8555;

class ApplicationServer {
  constructor(app) {
    this.app = app;
  }

  start() {
    this.#connectDatabase();
    this.#standardMiddleware(this.app);
    this.#routes(this.app);
    this.#globalErrorHandling(this.app);
    this.#startServer(this.app);
  }

  #connectDatabase() {
    MongoDBConnection.getInstance();
    MysqlConnection.getInstance();
  }

  #standardMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
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
      const status = statusCode.startWiths("4") ? "fail" : "error";
      const message = error.message || "Internal server error";

      res.status(statusCode).json({
        status,
        message,
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
