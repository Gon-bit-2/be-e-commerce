// redis.service.js
'use strict'

import { createClient, type RedisClientType } from 'redis'
import { reservationInventory } from '~/model/repositories/inventory.repo'
import 'dotenv/config'
import { RedisErrorResponse } from '~/middleware/error.middleware'
const uri = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@redis-12986.c8.us-east-1-2.ec2.redns.redis-cloud.com:12986`
const URI_DOCKER = `redis://host.docker.internal:6379`
// ✅ Dùng ReturnType để tự động lấy đúng kiểu dữ liệu của client
// Dòng này có nghĩa là: "Kiểu RedisClient là bất cứ kiểu gì mà hàm createClient trả về"
type RedisClient = ReturnType<typeof createClient>
class RedisService {
  client: any = {}
  statusCodeConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  }
  connectionTimeout: any = null
  REDIS_CONNECT_TIMEOUT = 10000
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: 'Lỗi Rồi Anh Em Ơi',
      en: 'Connected Error'
    }
  }

  handleEventTimeoutError = () => {
    this.connectionTimeout = setTimeout(() => {
      throw new RedisErrorResponse(this.REDIS_CONNECT_MESSAGE.message.vn, this.REDIS_CONNECT_MESSAGE.code)
    }, this.REDIS_CONNECT_TIMEOUT)
  }
  handleEventConnect = ({ connectionRedis }: any) => {
    connectionRedis.on(this.statusCodeConnectRedis.CONNECT, () => {
      console.log(`connectionRedis- connection status:connected`)
      clearTimeout(this.connectionTimeout)
    })
    connectionRedis.on(this.statusCodeConnectRedis.END, () => {
      console.log(`connectionRedis- connection status:disconnected`)
      this.handleEventTimeoutError()
    })
    connectionRedis.on(this.statusCodeConnectRedis.RECONNECT, () => {
      console.log(`connectionRedis- connection status:RECONNECTED`)
      clearTimeout(this.connectionTimeout)
    })
    connectionRedis.on(this.statusCodeConnectRedis.ERROR, (err: Error) => {
      console.log(`connectionRedis- connection status:error:,${err}`)
      this.handleEventTimeoutError()
    })
  }

  initRedis = async () => {
    const instanceRedis = createClient({
      url: URI_DOCKER
    })
    this.client.instanceConnect = instanceRedis
    this.handleEventConnect({
      connectionRedis: instanceRedis
    })
    await instanceRedis.connect()
  }
  getClient(): RedisClient {
    return this.client
  }
  closeRedis = () => {
    if (this.client.instanceConnect) {
      this.client.instanceConnect.quit()
    }
  }
  /**
   * Thử giành quyền khóa một tài nguyên.
   * @param {string} productId - ID của sản phẩm cần khóa.
   * @param {string} cartId - ID của giỏ hàng, dùng làm giá trị của lock.
   * @returns {string|null} - Trả về "key" của lock nếu thành công, ngược lại trả về null.
   */
  async acquireLock(productId, quantity, cartId) {
    const key = `lock_v2025_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3 giây

    for (let i = 0; i < retryTimes; i++) {
      // 3. Dùng lệnh SET với tùy chọn NX và PX để thao tác nguyên tử
      // - NX: Chỉ set key nếu nó chưa tồn tại.
      // - PX: Set thời gian hết hạn (tính bằng mili-giây).
      const result = await this.client.set(key, cartId, {
        PX: expireTime,
        NX: true
      })

      // Nếu result là 'OK', có nghĩa là lock đã được thiết lập thành công
      if (result === 'OK') {
        // Thao tác với inventory ở đây...
        const isReversation = await reservationInventory({ productId, quantity, cartId })
        if (isReversation.modifiedCount) {
          await this.releaseLock(key, cartId)
        }
        return key // Trả về key để sau này có thể giải phóng
      } else {
        // Nếu không giành được lock, đợi 50ms rồi thử lại
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    // Nếu hết số lần thử mà vẫn không có lock
    console.log(`Could not acquire lock for key: ${key} after ${retryTimes} retries.`)
    return null
  }

  /**
   * Giải phóng lock một cách an toàn.
   * @param {string} key - Key của lock cần giải phóng.
   * @param {string} cartId - ID của giỏ hàng, phải khớp với giá trị của lock.
   */
  async releaseLock(key, cartId) {
    // 4. Dùng Lua script để đảm bảo chỉ đúng người giữ khóa mới xóa được
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `

    try {
      const result = await this.client.eval(luaScript, {
        keys: [key],
        arguments: [cartId]
      })

      if (result === 1) {
        console.log(`Lock released successfully for key: ${key}`)
      }
    } catch (err) {
      console.error('Error releasing lock:', err)
    }
  }
}

// Xuất ra một instance của service để dùng trong toàn bộ ứng dụng (Singleton Pattern)
const redisService = new RedisService()
export default redisService
