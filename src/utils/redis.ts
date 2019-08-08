import * as Redis from 'redis'
import { promisify } from 'util'

export const redisClient = Redis.createClient(6379)
export const asyncGet = promisify(redisClient.get).bind(redisClient)
