import { Request, Response } from 'express';
import {AgencyModel} from "../models/agency.model";
import {ResponseType} from "../types/response.types";
import {StatusCodes} from "http-status-codes";
import {ICustomRequest} from "../types/customrequest.types";
import {IToken} from "../types/token.types";
import {User} from "../models/user.model";
import {Document} from "mongoose";
import {Status} from "../types/agency.types";

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
        const newAgency = new AgencyModel({
            name,
            central,
            state,
            contactEmail,
            contactNumber,
            status: 'pending'
        })

        // saving new agency
        await newAgency.save();
        const response: ResponseType<Document<any>> = {
            code: StatusCodes.CREATED,
            success: true,
            data: {
                body: newAgency,
                message: 'new agency created'
            },
            error: null
        }
        res.status(response.code!).send(response);
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

/**
 * get all agencies
 * @param req
 * @param res
 * */
export const getAllAgencies = async (req: Request, res: Response) => {
    try {
        const { id } = (req as ICustomRequest).decoded as IToken;

        // checking if the user is super admin then only he can view all the agencies
        const user = await User.findById(id);
        if (!user || user.role != 4) {
            const err: ResponseType<any> = {
                code: StatusCodes.UNAUTHORIZED,
                data: null,
                error: {
                    message: 'user not authorized for this route'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        const agencies = await AgencyModel.find({});
        const response: ResponseType<any> = {
            code: StatusCodes.OK,
            success: true,
            data: {
                body: agencies,
                message: 'fetched agencies'
            },
            error: null
        }
        res.status(response.code!).send(response);

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

        console.error('error in get all agencies controller: ', e)
    }
}

/**
 * approve agency
 * @param req
 * @param res
 */
export const approveAgency = async (req: Request, res: Response) => {
    try {
        const { id } = (req as ICustomRequest).decoded as IToken;

        // checking if the user is super admin then only he can view all the agencies
        const user = await User.findById(id);
        if (!user || user.role != 4) {
            const err: ResponseType<any> = {
                code: StatusCodes.UNAUTHORIZED,
                data: null,
                error: {
                    message: 'user not authorized for this route'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        const { agencyId } = req.params;
        const { status } = req.body
        const agency = await AgencyModel.findById(agencyId);
        if (!agency) {
            const err: ResponseType<any> = {
                code: StatusCodes.UNAUTHORIZED,
                data: null,
                error: {
                    message: 'agency cannot be found with given id'
                },
                success: false
            }
            res.status(err.code!).send(err);
            return;
        }

        // checks if given status is in enum or not,
        // if yes, then update it status
        // else send error back in response
        if (status in Status) {
            agency.status = status;
            await  agency.save();

            const response: ResponseType<null> = {
                code: StatusCodes.OK,
                success: true,
                data: {
                    body: null,
                    message: 'agency status updated'
                },
                error: null
            }
            res.status(response.code!).send(response);
            return;
        } else {
            const err: ResponseType<any> = {
                code: StatusCodes.BAD_REQUEST,
                data: null,
                error: {
                    message: 'status not allowed'
                },
                success: false
            }
            res.status(err.code!).send(err);
        }
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

        console.error('error in approve agency controller: ', e)
    }
}
