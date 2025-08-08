// src/services/redisPubsub.service.ts
'use strict'

import { createClient, RedisClientType } from 'redis'
import 'dotenv/config'

// URI kết nối tới Redis, tương tự file redis.service.ts của bạn

class RedisPubSubService {
  private subscriber: RedisClientType
  private publisher: RedisClientType

  constructor() {
    // Khởi tạo 2 client riêng biệt: một cho publish và một cho subscribe
    this.publisher = createClient({ url: process.env.URI_DOCKER })
    this.subscriber = createClient({ url: process.env.URI_DOCKER })

    // Lắng nghe sự kiện lỗi để gỡ lỗi
    this.publisher.on('error', (err) => console.error('Redis Publisher Error:', err))
    this.subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err))

    // Thực hiện kết nối
    this.connect()
  }

  /**
   * Kết nối cả hai client publisher và subscriber tới Redis
   */
  private async connect(): Promise<void> {
    try {
      await this.publisher.connect()
      await this.subscriber.connect()
      console.log('Redis Pub/Sub clients connected successfully.')
    } catch (error) {
      console.error('Failed to connect Pub/Sub clients to Redis:', error)
    }
  }

  /**
   * Gửi một tin nhắn đến một channel cụ thể.
   * @param channel Kênh để đăng tin nhắn.
   * @param message Nội dung tin nhắn.
   * @returns Promise trả về số lượng client đã nhận được tin nhắn.
   */
  public async publish(channel: string, message: string | Record<string, any>): Promise<number> {
    // Đảm bảo client đã sẵn sàng trước khi gửi
    if (!this.publisher.isOpen) {
      await this.publisher.connect()
    }

    // Chuyển đổi message thành chuỗi JSON nếu nó là một object
    const messageToSend = typeof message === 'object' ? JSON.stringify(message) : message

    console.log(`Publishing message to channel "${channel}":`, messageToSend)
    return this.publisher.publish(channel, messageToSend)
  }

  /**
   * Đăng ký lắng nghe tin nhắn từ một channel.
   * @param channel Kênh muốn lắng nghe.
   * @param callback Hàm sẽ được gọi mỗi khi có tin nhắn mới trên channel.
   */
  public subscribe(channel: string, callback: (channel: string, message: string) => void): void {
    // Phương thức .subscribe của redis v4+ nhận một callback để xử lý tin nhắn
    this.subscriber.subscribe(channel, (message, subscribedChannel) => {
      // Gọi hàm callback mà người dùng đã cung cấp với dữ liệu nhận được
      if (channel === subscribedChannel) callback(channel, message)
    })
    console.log(`Subscribed to channel: "${channel}"`)
  }
}

// Xuất một thực thể duy nhất của class (Singleton Pattern), giống như các service khác trong dự án
const redisPubsubService = new RedisPubSubService()
export default redisPubsubService
