import {StatusCodes} from "http-status-codes";

export interface dataInterface<T> {
    body: T,
    message: string
}

export interface errorInterface {
    message: string,
}

export type ResponseType<T> = {
    success: boolean,
    code: StatusCodes,
    data: dataInterface<T> | null,
    error: errorInterface | null
}