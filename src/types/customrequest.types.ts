import { JwtPayload } from "jsonwebtoken";
import { IToken } from "./token.types";
import { Request } from "express";

export interface ICustomRequest extends Request {
    decoded: IToken | string | JwtPayload
}