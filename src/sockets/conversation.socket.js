let socketIOObject;

class ConservationSocketHandler {
  constructor(io) {
    this.io = io;
    socketIOObject = io;
  }

  listen() {
    this.io.on("connection", (socket) => {
      socket.on("message:send", (data) => {
        console.log('SEND MESSAGE', data);

        socket.broadcast.emit("message:receive", data);
      });

      socket.on('message:delete', (data) => {
        console.log('DELETE MESSAGE', data);
        
        socket.broadcast.emit('message:deleted', data);
      });
    });
  }
}

module.exports = { ConservationSocketHandler, socketIOObject };
