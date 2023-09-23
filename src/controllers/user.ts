import { Request, Response } from "express";
import { Error, Success } from "../types/response.types";
import { IUser } from "../types/user.types";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";

/**
 * Create user 
 */
export const createUser = async (user: IUser, req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, role, agency } = req.body;

        // if the role of user is lesser than requested role to be created, throw error
        if (role >= user.role) {
            const err: Error = {
                message: 'User not allowed to create',
                err: 'NA',
                code: StatusCodes.UNAUTHORIZED
            }
            res.status(err.code!).send(err);
            return;
        }
        // required fields, cannot be empty 
        else if (!firstName || !lastName || !email || !password) {
            const err: Error = {
                message: 'first name, or last name, or email or password cannot be empty',
                err: 'NA',
                code: StatusCodes.BAD_REQUEST
            }
            res.status(err.code!).send(err);
            return;
        }
        // if the role is <= 3, i.e. is associated with a agency, then it cannot be undefined 
        else if (user.role <= 3 && agency == undefined) {
            const err: Error = {
                message: 'Agency cannot be undefined',
                err: 'NA',
                code: StatusCodes.BAD_REQUEST
            }
            res.status(err.code!).send(err);
            return;
        }

        // new user created
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            agency
        });
        await newUser.save();

        const response: Success = {
            message: 'user created',
            code: StatusCodes.CREATED
        }

        res.send(response.message!).send(response);
    } catch (error) {
        console.error('error in create user controller: ', error)
    }
}