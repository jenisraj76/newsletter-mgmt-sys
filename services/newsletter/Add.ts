import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import multer from "multer";
import { User } from "../../models/User.entity";
import csvtojsonV2 from "csvtojson/v2";
import { Newsletter } from "../../types/Newsletter";
import { getConnection } from "typeorm";
import Mustache from "mustache";
import { RabbitMq } from "../../config/RabbitMq";
import { getRabbitMqChannel } from "../../loaders/RabbitMq";
import fs from "fs";

export default [multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("csv")) {
            cb(null, true);
        } else {
            cb(new Error('Accepted Only CSV files'));
        }
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/temp')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname)
        }
    })
}).single('newsletter'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return next();
        let result = await add(req.file);
        return res.status(200).send(result);
    } catch (err) {
        next(err);
    }
}]

const add = async (file: Express.Multer.File): Promise<any> => {
    const jsonArray: Newsletter[] = await csvtojsonV2({
        headers: ["email", 'newsletterName', 'content']
    }).fromFile(file.path);
    validateReq(jsonArray);
    for (let e of jsonArray) {
        let newsletter = await rebuildContent(e);
        if (!newsletter) continue;
        await insertInqueue(newsletter);
    }
    fs.unlinkSync(file.path);
    return { isSuccess: true };
}

const validateReq = (req: Newsletter[]) => {
    let schema: yup.SchemaOf<Newsletter[]> = yup.array(yup.object().shape({
        content: yup.string().required(),
        newsletterName: yup.string().required(),
        email: yup.string().email().required()
    }).required());
    schema.validateSync(req);
}

const rebuildContent = async (newsletter: Newsletter): Promise<Newsletter | undefined> => {
    let user = await findUserByEmail(newsletter.email);
    if (!user) return;
    let content = Mustache.render(newsletter.content, user);
    newsletter.content = content;
    return newsletter;
}

const insertInqueue = async (newsletter: Newsletter): Promise<void> => {
    const channel = getRabbitMqChannel();
    channel.sendToQueue(RabbitMq.EMAIL_QUEUE_NAME, Buffer.from(JSON.stringify(newsletter)));
}

const findUserByEmail = async (email: string): Promise<User | undefined> => {
    let repository = getConnection().getRepository(User);
    let user = await repository.findOne({ where: { email: email } });
    return user;
}