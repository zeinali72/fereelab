import { Pool } from 'pg';
import { createClient, RedisClientType } from 'redis';

let pgPool: Pool | null = null;
let redisClient: RedisClientType | null = null;

export function getPgPool(): Pool {
  if (!pgPool) {
    pgPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fereelab_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    });
  }
  return pgPool;
}

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    
    redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
    
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  return redisClient;
}