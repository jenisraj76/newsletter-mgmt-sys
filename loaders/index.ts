import { initiateRabbitMqChannelConnection, } from "./RabbitMq";
import { initiateTypeORMConnection } from "./Typeorm";

export default async () => {
    let promises: Promise<void>[] = [
        initiateTypeORMConnection(),
        initiateRabbitMqChannelConnection(),
    ];
    return await Promise.all(promises);
}