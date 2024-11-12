const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");
const redis = require("redis");

const app = express();
const server = createServer(app);

app.use(express.json());

const redisClient = redis.createClient({
  url: "redis://forsicoRedisCache.redis.cache.windows.net:6379",
  password: "j1hRUVSdyRqq3ss4608oA0IuHIGpoI17UAzCaL4hUvI=",
});

redisClient.connect();

const wss = new WebSocket.Server({
  server,
});

const clientChannelsMap = new WeakMap();

redisClient.on("ready", () => {
  console.log("Redis client is ready.");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

wss.on("connection", (ws) => {
  clientChannelsMap.set(ws, []);

  ws.on("message", async (data) => {
    const { channels } = JSON.parse(data);
    console.log("DATA", data);
    if (Array.isArray(channels)) {
      const subscribedChannels = clientChannelsMap.get(ws) || [];

      channels.forEach(async (channel) => {
        if (!subscribedChannels.includes(channel)) {
          await redisClient.subscribe(channel, (message) => {
            console.log(`Received message from ${channel}: ${message}`);

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  channel,
                  message,
                })
              );
            }
          });

          subscribedChannels.push(channel);
        }
      });

      clientChannelsMap.set(ws, subscribedChannels);
    } else {
      ws.send(JSON.stringify({ error: "Channels must be an array." }));
    }
  });

  ws.on("close", () => {
    clientChannelsMap.delete(ws);
  });
});

const PORT = process.env.PORT || 8445;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
