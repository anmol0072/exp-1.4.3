import { createClient } from "redis";

let redisClient = null;

try {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on("error", (err) => console.log("Redis Error:", err));

  await redisClient.connect();
  console.log("Redis connected");
} catch (error) {
  console.log("Redis not available, using memory storage");
}

export { redisClient };