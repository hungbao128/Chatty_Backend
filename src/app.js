const express = require('express');
const ApplicationServer = require('./server');

class Application{
    initialize(){
        const app = express();
        const server = new ApplicationServer(app);
        server.start();
    }
}

const app = new Application();
app.initialize();