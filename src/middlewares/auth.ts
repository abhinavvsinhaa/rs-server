import jwt, {Secret} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv'
import {ResponseType} from '../types/response.types';
import {StatusCodes} from 'http-status-codes';
import {ICustomRequest} from '../types/customrequest.types';

dotenv.config({ path: '../.env' })

const secret: Secret = process.env.SECRET!;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');
        
        // returning if token not present
        if (!token) {
            const err: ResponseType<any> = {
                error: {
                    message:'unauthenticated'
                },
                data:null,
                success:false,
                code: StatusCodes.UNAUTHORIZED
            }
            res.status(err.code!).send(err);
            return;
        }

        // decoding token
        (req as ICustomRequest).decoded = jwt.verify(token, secret);
        
        next();
    } catch (error: any) {
        const err: ResponseType<any> = {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
                message:'error in auth middleware'
            },
            data:null,
            success:false,
        }
        res.status(err.code!).send(err);
        
        console.error('error in auth middleware: ', error);
    }
}