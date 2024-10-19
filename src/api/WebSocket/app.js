const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const redis = require('redis');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const redisClient = redis.createClient();
redisClient.subscribe('workspace:123:board:456');


redisClient.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(process.env.PORT || 30001, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
