'use strict'
import amqplib from 'amqplib'
import { buffer } from 'stream/consumers'
async function consumerOrderedMessage() {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'ordered-queue-message'
    await channel.assertQueue(queueName, {
      exclusive: false,
      durable: true
    })
    for (let i = 0; i < 10; i++) {
      const message = `ordered-queue-message:${i} `
      console.log(message)
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true
      })
      setTimeout(() => {
        connection.close()
      }, 10000)
    }
  } catch (error) {
    console.error(`Error occurred while sending message`, error)
  }
}
consumerOrderedMessage().catch((err) => console.error(err))
