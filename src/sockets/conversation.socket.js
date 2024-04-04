const CONVERSATIONS = new Map();

class ConservationSocketHandler {
  constructor(io) {
    this.io = io;
  }

  listen() {
    this.io.on("connection", (socket) => {
      socket.on("message:send", (data) => {
        console.log('SEND MESSAGE', data);

        socket.boardcast.emit("message:receive", data);
      });

      socket.on("conversation:join", (data) => {
        
      });
    });
  }
}

module.exports = { ConservationSocketHandler };
