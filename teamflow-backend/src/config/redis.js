import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);

  redis.on("connect", () => console.log("Redis connected"));
  redis.on("error", (err) => console.error("Redis error:", err));
} else {
  console.log("Redis not configured");
}

export default redis;



// import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379
// })

// redis.on("connect", () => console.log("Redis Connected"))
// redis.on("error", (err) => console.error("Redis Connection Error:", err))

// export default redis