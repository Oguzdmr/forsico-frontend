const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");
const redis = require("redis");

const app = express();
const server = createServer(app);

// JSON veriyi almak için middleware
app.use(express.json());

const redisClient = redis.createClient({
  url: "redis://forsicoRedisCache.redis.cache.windows.net:6379",
  password: "j1hRUVSdyRqq3ss4608oA0IuHIGpoI17UAzCaL4hUvI=",
});

redisClient.connect();

const wss = new WebSocket.Server({
  server,
});

let subscribedChannels = [];

app.post("/subscribe", (req, res) => {
  const { channels } = req.body;

  if (!Array.isArray(channels)) {
    return res.status(400).json({
      error: "Channels must be an array.",
    });
  }

  channels.forEach((channel) => {
    if (!subscribedChannels.includes(channel)) {
      redisClient.subscribe(channel, (message, channel) => {
        console.log(`Received message from ${channel}: ${message}`);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                channel,
                message,
              })
            );
          }
        });
      });
      subscribedChannels.push(channel);
      console.log(`Subscribed to Redis channel: ${channel}`);
    }
  });

  res.status(200).json({
    message: "Subscribed to channels successfully.",
  });
});

redisClient.on("ready", () => {
  console.log("Redis client is ready.");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
