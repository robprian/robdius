import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Check if Redis is enabled
const isRedisEnabled = process.env.REDIS_URL && process.env.REDIS_URL !== '';

let redisClient = null;

if (isRedisEnabled) {
  // Redis Configuration for production
  const redisConfig = {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD || undefined
  };

  // Add TLS config for production Redis
  if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL.includes('redis-cloud.com')) {
    redisConfig.socket = {
      tls: false, // Redis Cloud uses regular connection
      rejectUnauthorized: false
    };
  }

  redisClient = createClient(redisConfig);

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    console.log('🔄 Redis ready for use');
  });

  redisClient.on('end', () => {
    console.log('❌ Redis connection ended');
  });
} else {
  console.log('⚠️  Redis is disabled for local development');
}

export const connectRedis = async () => {
  if (!isRedisEnabled) {
    console.log('⚠️  Redis connection skipped (disabled)');
    return null;
  }

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Unable to connect to Redis:', error);
    throw error;
  }
};

export default redisClient;
