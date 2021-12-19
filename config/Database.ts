export class Database {
    static readonly CONNECTION = process.env.TYPEORM_CONNECTION || "mysql";
    static readonly HOST = process.env.TYPEORM_HOST || "localhost";
    static readonly USERNAME = process.env.TYPEORM_USERNAME || "root";
    static readonly PASSWORD = process.env.TYPEORM_PASSWORD || "";
    static readonly DATABASE = process.env.TYPEORM_DATABASE || "";
    static readonly SCHEMA = process.env.TYPEORM_SCHEMA || "";
    static readonly PORT = Number(process.env.TYPEORM_PORT||'3306');
    static readonly ENTITIES = "dist/models/**/*.entity.js";
}
