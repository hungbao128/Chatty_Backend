class ConservationSocketHandler {
  constructor(io) {
    this.io = io;
  }

  listen() {
    this.io.on("connection", (socket) => {
      socket.on("message:send", (data) => {});

      socket.on("conversation:join", (data) => {});
    });
  }
}

module.exports = { ConservationSocketHandler };
