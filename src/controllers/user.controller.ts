import { Request, Response } from "express";
import { ResponseType } from "../types/response.types";
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
            const err: ResponseType<any> = {
                data:null,
                code: StatusCodes.BAD_REQUEST,
                error: {
                    message:'no user exists with the id'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        const { firstName, lastName, email, password, role, agency } = req.body;

        // if the role of user is lesser than requested role to be created, throw error
        if (role >= user.role) {
            const err: ResponseType<any> = {
                code: StatusCodes.UNAUTHORIZED,
                data:null,
                error: {
                    message:'User not allowed to create'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }
        // required fields, cannot be empty 
        else if (!firstName || !lastName || !email || !password) {
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data:null,
                error: {
                    message:'first name, or last name, or email or password cannot be empty'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }
        // // if the role is <= 3, i.e. is associated with a agency, then it cannot be undefined
        else if (user.role <= 3 && !agency) {
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data:null,
                error: {
                    message:'Agency cannot be undefined'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        // if user exists with that email already, it is a bad request
        const userExists = await User.findOne({email:email});
        if(userExists){
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data:null,
                error: {
                    message:'User already exists with this email'
                },
                success: false
            }
            return res.status(err.code!).send(err);
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

        const response: ResponseType<null> = {
            code: StatusCodes.CREATED,
            data: {
                body:null,
                message:'user created'
            },
            error: null,
            success: true
        }

        return res.send(response);
    } catch (error) {
        const err: ResponseType<any> = {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            data:null,
            error: {
                message:''
            },
            success: false
        }
        console.error('error in create user controller: ', error)
        return res.status(err.code!).send(err);
    }
}

export const loginUser = async (req: Request, res: Response)  => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // user not found
        if (!user) {
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data:null,
                error: {
                    message:'no user exists with the entered email id'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        const cmp = await bcrypt.compare(password, user.hash);
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

            const response: ResponseType<null> = {
                code: 200,
                error:null,
                success:true,
                data:{
                    body:null,
                    message:'user logged in'
                }
            }
            res.status(response.code!).send(response);
            return;
        } else {
            // password do not matches with hash
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data:null,
                error: {
                    message:'username or password do not match'
                },
                success: false
            }
            res.status(err.code!).send(err);
        }


    } catch (error) {
        const err: ResponseType<any> = {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            data:null,
            error: {
                message:''
            },
            success: false
        }
        res.status(err.code!).send(err);

        console.error('error in create user controller: ', error)
    }
}