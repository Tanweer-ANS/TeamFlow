import redis from "../config/redis.js";

export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error fetching cache:", error);
        return null;
    }
}

export const setCache = async (key, value, ttl = 60) => {
    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
        console.error("Error setting cache:", error);
    }
}

export const clearCacheByPattern = async (pattern) => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(keys);
    }
}