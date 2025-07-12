import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Upstash Redis Configuration
const redisClient = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL,
  password: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_PASSWORD,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Upstash Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('🔄 Upstash Redis ready for use');
});

redisClient.on('end', () => {
  console.log('❌ Redis connection ended');
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Unable to connect to Redis:', error);
    throw error;
  }
};

export default redisClient;
