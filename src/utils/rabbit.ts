import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();
  console.log('✅ Connected to RabbitMQ');
};

export const publishToQueue = async (queueName: string, data: any) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not established');
  }

  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};
