const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Serve static files
app.use(express.static('D:/ProtonParley/Server/wwwroot'));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const server = https.createServer({
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/crt.pem')
}, app);

const wss = new WebSocket.Server({ server });

let activeUsers = [];

wss.on('connection', (ws) => {
    // Generate peerId
    const peerId = uuidv4();
    
    // Add peerId to active users
    activeUsers.push(peerId);
    
    // Broadcast active users to all clients
    broadcastActiveUsers();

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });

    ws.on('close', () => {
        // Remove peerId from active users
        activeUsers = activeUsers.filter(id => id !== peerId);
        
        // Broadcast updated active users to all clients
        broadcastActiveUsers();
    });
});

function broadcastActiveUsers() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(activeUsers));
        }
    });
}

//Serve angular paths
app.all('*', function (req, res) {
    res.status(200).sendFile(`/index.html`, {root: "wwwroot"});
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is listening on port 3000');
});
