import { Request, Response } from 'express';
import {Agency} from "../models/agency.model";
import {ResponseType} from "../types/response.types";
import {StatusCodes} from "http-status-codes";

/**
 * Create agency or sign up agency
 * @param req
 * @param res
 * */
export const registerAgency = async (req: Request, res: Response) => {
    try {
        const { name, central, state, contactEmail, contactNumber } = req.body;

        if (!name || !central || !state || !contactEmail || !contactNumber) {
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data: null,
                error: {
                    message: 'essential details cannot be empty'
                },
                success: false
            }
            res.status(err.code!).send(err);
        }

        // creating new agency with pending status, will be approved by super admin
        const newAgency = new Agency({
            name,
            central,
            state,
            contactEmail,
            contactNumber,
            status: 'pending'
        })

        // saving new agency
        await newAgency.save();
    } catch (e) {
        const err: ResponseType<any> = {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
            error: {
                message: ''
            },
            success: false
        }
        res.status(err.code!).send(err);

        console.error('error in register agency controller: ', e)
    }
}