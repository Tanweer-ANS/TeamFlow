import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisOptions = redisUrl?.startsWith("rediss://") ? { tls: {} } : {};

const redis = redisUrl
  ? new Redis(redisUrl, redisOptions)
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    });

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export default redis;



// import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379
// })

// redis.on("connect", () => console.log("Redis Connected"))
// redis.on("error", (err) => console.error("Redis Connection Error:", err))

// export default redis