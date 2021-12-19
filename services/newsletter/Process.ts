import { Logs } from "../../models/Logs.entity";
import rabbit from 'amqplib';
import { RabbitMq } from "../../config/RabbitMq";
import { getRabbitMqChannel } from "../../loaders/RabbitMq";
import { Newsletter } from "../../types/Newsletter";
import { sendEmail } from "../smtp";
import { MailOptions } from "../../types/SMTP";
import { getConnection } from "typeorm";

export default async () => {
    const channel = getRabbitMqChannel();
    await channel.assertExchange(RabbitMq.EMAIL_EXCHANGE_NAME, RabbitMq.EMAIL_EXCHANGE_TYPE);
    await channel.assertQueue(RabbitMq.EMAIL_QUEUE_NAME);
    await channel.bindQueue(RabbitMq.EMAIL_QUEUE_NAME, RabbitMq.EMAIL_EXCHANGE_NAME, RabbitMq.EMAIL_KEY);
    await channel.assertQueue(RabbitMq.PARKING_QUEUE_NAME);
    await channel.bindQueue(RabbitMq.PARKING_QUEUE_NAME, RabbitMq.EMAIL_EXCHANGE_NAME, RabbitMq.EMAIL_KEY);
    let a = await channel.consume(RabbitMq.EMAIL_QUEUE_NAME, proccessMail);
}

const proccessMail = async (m: rabbit.ConsumeMessage | null) => {
    if (!m) return;
    const newsletter: Newsletter = JSON.parse(m.content.toString());
    let mailOptinon: MailOptions = {
        body: newsletter.content,
        subject: newsletter.newsletterName,
        toEmail: [newsletter.email]
    };
    try {
        await sendEmail(mailOptinon);
        let logs = createInstance(newsletter.email, newsletter.newsletterName);
        await InsertInDb(logs);
    } catch (e) {
        await insertInPakingqueue(newsletter);
    }
    acknowledgeMessage(m);
}

const acknowledgeMessage = (m: rabbit.ConsumeMessage) => {
    const channel = getRabbitMqChannel();
    channel.ack(m);
}

const createInstance = (emailId: string, newsletterName: string): Logs => {
    let user = new Logs();
    user.emailId = emailId;
    user.newsletterName = newsletterName;
    return user;
}

const InsertInDb = async (newLog: Logs): Promise<number> => {
    let repository = getConnection().getRepository(Logs);
    let log = await repository.save(newLog);
    return log.id;
}

const insertInPakingqueue = async (newsletter: Newsletter): Promise<void> => {
    const channel = getRabbitMqChannel();
    channel.sendToQueue(RabbitMq.PARKING_QUEUE_NAME, Buffer.from(JSON.stringify(newsletter)));
}