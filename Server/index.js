const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = https.createServer({
    key: fs.readFileSync('../Client/ProtonParley/ssl/key.pem'),
    cert: fs.readFileSync('../Client/ProtonParley/ssl/crt.pem')
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

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
