class ConservationSocketHandler {
    constructor(io) {
        this.io = io;
    }

    listen(){
        this.io.on('connection', (socket) => {
            socket.on('message:send', (data) => {

            })
        })
    }
}

module.exports = {ConservationSocketHandler};