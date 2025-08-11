import amqplib from 'amqplib'
const runConsumer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true })

    //send message
    await channel.consume(
      queueName,
      (messages) => {
        if (messages) console.log(`Received ${messages.content.toString()}`)
      },
      {
        noAck: true // Automatically acknowledge the message
      }
    )
  } catch (error) {
    console.error(`Error occurred while sending message`, error)
  }
}
runConsumer().catch(console.error)
