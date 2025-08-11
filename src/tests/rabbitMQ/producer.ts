import amqplib from 'amqplib'
const message = `hello,RabbitMQ for GonJS`
const runProducer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertExchange(queueName, 'topic', { durable: true })

    //send message
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log(`message sent`, message)
  } catch (error) {
    console.error(`Error occurred while sending message`, error)
  }
}
runProducer().catch(console.error)
