import { NextFunction, Request, Response } from "express";
import { getConnection } from "typeorm";
import * as yup from "yup";
import { User } from "../../models/User.entity";
import { NewUserRequest, NewUserRes } from "../../types/User.model";

export default [async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result = await save(req.body);
        return res.status(200).send(result);
    } catch (err) {
        next(err);
    }
}]

const save = async (req: NewUserRequest): Promise<NewUserRes> => {
    ValidateReq(req);
    let newUser = createInstance(req);
    let result = await InsertInDb(newUser);
    return { userId: result };
}

const ValidateReq = (req: NewUserRequest) => {
    let schema: yup.SchemaOf<NewUserRequest> = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        age: yup.number().required().integer()
    }).required();
    schema.validateSync(req);
}

const createInstance = (req: NewUserRequest): User => {
    let user = new User();
    user.age = req.age;
    user.email = req.email;
    user.firstName = req.firstName;
    user.lastName = req.lastName;
    return user;
}

const InsertInDb = async (newUser: User): Promise<number> => {
    let repository = getConnection().getRepository(User);
    let user = await repository.save(newUser);
    return user.id;
}