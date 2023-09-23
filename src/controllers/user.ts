import { Request, Response } from "express";
import { Error, Success } from "../types/response.types";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import jwt, { Secret } from 'jsonwebtoken'
import { IToken } from "../types/token.types";
import { ICustomRequest } from "../types/customrequest.types";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

const secret: Secret = process.env.SECRET!;
const saltRounds = Number(process.env.SALT_ROUNDS!);

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

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        // new user created
        const newUser = new User({
            firstName,
            lastName,
            email,
            hash,
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
        const err: Error = {
            message: '',
            err: error,
            code: StatusCodes.INTERNAL_SERVER_ERROR
        }
        res.status(err.code!).send(err);

        console.error('error in create user controller: ', error)
    }
}

export const logInUser = async (req: Request, res: Response)  => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // user not found
        if (!user) {
            const err: Error = {
                message: 'no user exists with the entered email id',
                code: StatusCodes.BAD_REQUEST,
                err: 'NA'
            }
            res.status(err.code!).send(err);
            return;
        }

        const cmp = await bcrypt.compare(password, user.password);
        // password matches
        if (cmp) {
            // sign token 
            const payload: IToken = { id: user._id }

            // creating new token
            const userToken = jwt.sign(payload, secret, {
                expiresIn: '24h'
            })

            // setting the token for new user
            user.token = userToken;
            await user.save();

            // setting cookie
            res.cookie('token', userToken, {
                maxAge: 24*60*60*1000 // 24h, in ms
            })

            const response: Success = {
                message: 'user logged in',
                code: 200,
            }
            res.status(response.code!).send(response);
            return;
        } else {
            // password do not matches with hash
            const err: Error = {
                message: 'username or password do not match',
                err: 'NA',
                code: StatusCodes.BAD_REQUEST
            }
            res.status(err.code!).send(err);
        }


    } catch (error) {
        const err: Error = {
            message: '',
            err: error,
            code: StatusCodes.INTERNAL_SERVER_ERROR
        }
        res.status(err.code!).send(err);

        console.error('error in create user controller: ', error)
    }
}