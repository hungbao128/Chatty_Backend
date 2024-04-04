
const CONNECTED_USERS = new Map();

class UserSocketHandler {
    constructor(io) {
        this.io = io;
    }
    
    listen(){
        this.io.on('connection', (socket) => {
            console.log(`User connected (${socket.id}) to socket server at ${new Date()}`);
            socket.on('disconnect', () => {
                console.log(`User disconnected with userId: ${data.userId}`);
                this.removeSocketId(socket);
                console.table(CONNECTED_USERS);
            });

            socket.on('user_connected', (data) => {
                console.log(`User connected with userId: ${data.userId}`);
                this.addSocketId(data.userId, socket.id);
                console.table(CONNECTED_USERS);
            });
        });
    }

    addSocketId(userId, socketId) {
        if (CONNECTED_USERS.has(userId)) {
            const sockets = CONNECTED_USERS.get(userId);
            sockets.push(socketId);
            CONNECTED_USERS.set(userId, sockets);
        } else {
            CONNECTED_USERS.set(userId, [socketId]);
        }
    }

    removeSocketId(socket) {
        CONNECTED_USERS.forEach((sockets, userId) => {
            const index = sockets.indexOf(socket.id);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    CONNECTED_USERS.delete(userId);
                } else {
                    CONNECTED_USERS.set(userId, sockets);
                }
            }
        });
    }
}

module.exports = {UserSocketHandler};