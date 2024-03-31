
const CONNECTED_USERS = new Map();

class UserSocketHandler {
    constructor(io) {
        this.io = io;
    }
    
    listen(){
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('user_connected', (data) => {
                console.log('user connected', data);
                CONNECTED_USERS.set(data.userId, socket.id);
            });
        });
    }
}

module.exports = {UserSocketHandler};