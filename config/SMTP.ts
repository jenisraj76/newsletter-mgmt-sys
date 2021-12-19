export class SMTP {
    static readonly HOST = process.env.SMTP_HOST || 'localhost';
    static readonly PORT = Number(process.env.SMTP_PORT);
    static readonly USERNAME = process.env.SMTP_USERNAME || "";
    static readonly PASSWORD = process.env.SMTP_PASSWORD || "";
    static readonly FROM_EMAIL_ID = process.env.SMTP_FROM_EMAIL || '';
    static readonly IS_TLS = process.env.SMTP_IS_TLS == "true";
    static readonly FROM_NAME = process.env.SMTP_FROM_NAME || "";
}