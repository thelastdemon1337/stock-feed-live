const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Specify allowed origin
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Enable CORS for regular HTTP requests

// Create a Socket.io instance and apply CORS directly
const socketOptions = {
    cors: corsOptions
};
const socketServer = socketIo(server, socketOptions);

// Function to generate dummy stock price
function generateStockPrice() {
    // Generate a random stock price between 50 and 150
    return Math.floor(Math.random() * 101) + 50;
}

// Function to generate continuous stream of stock prices
function startStreaming() {
    setInterval(() => {
        const stockPrice = generateStockPrice();
        socketServer.emit('stockPriceUpdate', { price: stockPrice });
    }, 1000); // Update every second
}

// Set up routes
app.get('/', (req, res) => {
    res.send('Server is running. You can connect to socket for real-time stock price data.');
});

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    startStreaming();
});

// Handle socket connections
socketServer.on('connection', (socket) => {
    console.log('A client connected');
    console.log('Client IP address:', socket.handshake.address);
    console.log('Client Socket ID:', socket.id);
    
    // Send initial stock price data when a client connects
    const initialStockPrice = generateStockPrice();
    socket.emit('initialStockPrice', { price: initialStockPrice });

    socket.on('disconnect', () => {
        console.log('The Client disconnected : ', socket.handshake.address);
    });
});
