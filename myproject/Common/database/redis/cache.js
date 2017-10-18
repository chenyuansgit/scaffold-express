import { client as redis } from '../common/database/redis';

class Cache {
  // 构造函数
  constructor(prefix, expire) {
    this.redisKeyPrefix = prefix;
    // 过期时间： 5min~300  24h~3600 * 24
    this.redisExpire = expire;
  }

  // 获取缓存信息
  get(cookie) {
    const self = this;
    return new Promise(((resolve, reject) => {
      redis.get(self.redisKeyPrefix + cookie, (err, data) => {
        if (err) {
          reject(new Error(err.toString()));
          return;
        }
        resolve(JSON.parse(data));
      });
    }));
  }

  // 增加缓存信息
  set(cookie, options) {
    const self = this;
    return new Promise(((resolve, reject) => {
      redis.setex(self.redisKeyPrefix + cookie,
        self.redisExpire,
        JSON.stringify(options),
        (err, result) => {
          if (err) {
            reject(new Error(err.toString()));
            return;
          }
          resolve(result);
        });
    }));
  }

  // 修改缓存信息
  update(cookie, options) {
    const self = this;
    return new Promise(((resolve, reject) => {
      redis.set(self.redisKeyPrefix + cookie, JSON.stringify(options),
        (err, result) => {
          if (err) {
            reject(new Error(err.toString()));
            return;
          }
          resolve(result);
        });
    }));
  }

  // 删除缓存信息
  del(cookie) {
    const self = this;
    redis.del(self.redisKeyPrefix + cookie);
  }
}

export const userinfoCache = new Cache('redis_key_user_info:', 3600 * 24);
export const roomCache = new Cache('redis_key_room_status:', 3600 * 24);
