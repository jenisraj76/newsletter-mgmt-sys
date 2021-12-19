import nodemailer from "nodemailer";
import { SMTP } from "../config/SMTP";
import { MailOptions } from "../types/SMTP";


export const sendEmail = async (options: MailOptions) => {
    let credentials = {
        host: SMTP.HOST,
        port: SMTP.PORT,
        secure: SMTP.IS_TLS, // true for 465, false for other ports
        auth: {
            user: SMTP.USERNAME, // generated ethereal user
            pass: SMTP.PASSWORD // generated ethereal password
        }
    };

    let transporter = nodemailer.createTransport(credentials);

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `${SMTP.FROM_NAME} <${SMTP.FROM_EMAIL_ID}>`, // sender address
        to: options.toEmail.join(","), // list of receivers
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject, // Subject line
        html: options.body,// html body
        attachments: options.attachmentsList
    });
}





