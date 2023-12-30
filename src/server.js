const {Server} = require('socket.io');
const {createServer} = require('http')

const SERVER_PORT = 3000;

class ApplicationServer{
    #app;

    constructor(app){
        this.app = app;
    }

    start(){
        this.#connectDatabase();
        this.#startServer(this.app);
    }

    #connectDatabase(){

    }

    #createSocketIoServer(httpServer){
        const io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        })

        return io;
    }

    #startServer(app){
        const httpServer = createServer(app);
        const io = this.#createSocketIoServer(httpServer);

        httpServer.listen(SERVER_PORT, () => {
            console.log('Server listening on port ' + SERVER_PORT);
        })
    }
}

module.exports = ApplicationServer;