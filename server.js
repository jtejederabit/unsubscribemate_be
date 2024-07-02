require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./socket');

const server = http.createServer(app);
const io = new Server(server);

socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
