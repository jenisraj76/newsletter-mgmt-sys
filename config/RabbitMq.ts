export class RabbitMq {
    static readonly URL = process.env.RABBITMQ_URL || "amqp://localhost";
    static readonly EMAIL_QUEUE_NAME = 'newsletter_mail_queue';
    static readonly PARKING_QUEUE_NAME = 'parking-lot-queue';
    static readonly EMAIL_EXCHANGE_TYPE = 'direct';
    static readonly EMAIL_EXCHANGE_NAME = 'main';
    static readonly EMAIL_KEY = 'this-is/the@key';
}