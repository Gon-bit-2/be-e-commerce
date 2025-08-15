'use strict'
import amqplib from 'amqplib'
const message = `send a notification`
const log = console.log
console.log = function () {
  // eslint-disable-next-line prefer-rest-params
  log.apply(console, [new Date()].concat(Array.from(arguments)))
}

const runProducer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx' //direct noti
    const notiQueue = 'notificationQueueProcess' //assertQueue
    const notificationRoutingKey = 'notificationRoutingKey'
    //DLX khi xu ly thất bại
    const notificationExchangeDLX = 'notificationExDLX' //direct noti, thất bại
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
    //1.create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true //server chết thì vẫn còn message trong hàng đợi
    })
    //2.create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, //cho phép các connect truy vào cùng 1 hàng đợi
      deadLetterExchange: notificationExchangeDLX, //nếu notiQueue lỗi thì đi vào
      deadLetterRoutingKey: notificationRoutingKeyDLX //khóa định tuyến khớp DLX
    })
    //3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange, notificationRoutingKey)
    //4.send
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: 10000
    })
    console.log(`Send message:${message}`)

    // setTimeout(() => {
    //   connection.close()
    //   // process.exit(0)
    // }, 500)
  } catch (error) {
    console.error(`Error occurred while sending message`, error)
  }
}
runProducer().catch(console.error)
