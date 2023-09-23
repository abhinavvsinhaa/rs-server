import { Request, Response } from "express";
import { Error, Success } from "../types/response.types";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import jwt, { Secret } from 'jsonwebtoken'
import { IToken } from "../types/token.types";
import dotenv from 'dotenv';
import { ICustomRequest } from "../types/customrequest.types";
dotenv.config({ path: '../.env' })

const secret: Secret = process.env.SECRET!;

/**
 * Create user 
 */
export const createUser = async (req: Request, res: Response) => {
    try {
        const r = req as ICustomRequest;
        const decoded = r.decoded as IToken;

        // finding user with decoded id from token
        const user = await User.findById(decoded.id);

        if (!user) {
            const err: Error = {
                message: 'no user exists with the id',
                code: StatusCodes.BAD_REQUEST,
                err: 'NA'
            }
            res.status(err.code!).send(err);
            return;
        }

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

        const payload: IToken = { id: newUser._id }

        // creating new token
        const newUserToken = jwt.sign(payload, secret, {
            expiresIn: '24h'
        })

        // setting the token for new user
        newUser.token = newUserToken;

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