import redis from "../config/redis.js";

export const getCache = async (key) => {
  try {
    if (!redis) return null;

    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Cache get error:", err.message);
    return null;
  }
};

export const setCache = async (key, value, ttl = 60) => {
  try {
    if (!redis) return;

    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    console.error("Cache set error:", err.message);
  }
};

export const clearCacheByPattern = async (pattern) => {
  if (!redis) return;

  try {
    let cursor = "0";

    do {
      const result = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("Cache clear error:", err.message);
  }
};


// import redis from "../config/redis.js";

// export const getCache = async (key) => {
//     try {
//         const data = await redis.get(key);
//         return data ? JSON.parse(data) : null;
//     } catch (error) {
//         console.error("Error fetching cache:", error);
//         return null;
//     }
// }

// export const setCache = async (key, value, ttl = 60) => {
//     try {
//         await redis.set(key, JSON.stringify(value), "EX", ttl);
//     } catch (error) {
//         console.error("Error setting cache:", error);
//     }
// }

// export const clearCacheByPattern = async (pattern) => {
//     const keys = await redis.keys(pattern);
//     if (keys.length > 0) {
//         await redis.del(keys);
//     }
// }