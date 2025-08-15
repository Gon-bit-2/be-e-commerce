'use strict'
import amqplib from 'amqplib'
async function consumerOrderedMessage() {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, {
      durable: true
    })
    //set prefetch
    channel.prefetch(1) // xử lý tuần tự 1 tác vụ không thể đảm nhiệm 2 việc cùng lúc
    channel.consume(queueName, (msg) => {
      const message = msg?.content.toString()
      setTimeout(() => {
        console.log(`processed`, message)
        if (msg) channel.ack(msg)
      }, Math.random() * 1000)
    })
  } catch (error) {
    console.error(`Error occurred while sending message`, error)
  }
}
consumerOrderedMessage().catch((err) => console.error(err))
