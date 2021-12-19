import rabbit from 'amqplib';
import { RabbitMq } from '../config/RabbitMq';
import mailProcess from '../services/newsletter/Process';
let mqChannel: rabbit.Channel | null = null;
export const initiateRabbitMqChannelConnection = async () => {
    if (mqChannel) throw new Error('Already initilaized')
    let connection = await rabbit.connect(RabbitMq.URL);
    mqChannel = await connection.createChannel();
    await initiateRabbitMqQueueProcess()
}

export const initiateRabbitMqQueueProcess = async () => {
    let promises: Promise<void>[] = [
        mailProcess()
    ];
    await Promise.all(promises);
}

export const getRabbitMqChannel = () => {
    if (!mqChannel) throw new Error('Channel not created');
    return mqChannel;
}