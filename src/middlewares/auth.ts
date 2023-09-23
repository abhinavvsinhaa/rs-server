import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import { Error } from '../types/response.types';
import { StatusCodes } from 'http-status-codes';

dotenv.config({ path: '../.env' })

const secret: Secret = process.env.SECRET!;

interface ICustomRequest extends Request {
    token: string | JwtPayload
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');
        
        // returning if token not present
        if (!token) {
            const err: Error = {
                message: 'unauthenticated',
                err: 'NA',
                code: StatusCodes.UNAUTHORIZED
            }
            res.status(err.code!).send(err);
            return;
        }

        // decoding token
        const decoded = jwt.verify(token, secret);
        (req as ICustomRequest).token = decoded;
        
        next();
    } catch (error: any) {
        const err: Error = {
            message: 'error in auth middleware',
            err: error,
            code: StatusCodes.INTERNAL_SERVER_ERROR
        }
        res.status(err.code!).send(err);
        
        console.error('error in auth middleware: ', error);
    }
}