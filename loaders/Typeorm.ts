import { ConnectionOptions, createConnection } from "typeorm";
import { Database } from "../config/Database";

export const initiateTypeORMConnection = async () => {

    var dbconfig: ConnectionOptions =
    {
        type: Database.CONNECTION as any,
        host: Database.HOST,
        port: Database.PORT,
        username: Database.USERNAME,
        password: Database.PASSWORD,
        database: Database.DATABASE,
        schema: Database.SCHEMA,
        entities: [Database.ENTITIES]
    };
    await createConnection(dbconfig);
}


