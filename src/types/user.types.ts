import mongoose from "mongoose";

export enum Roles {
    TEAM_MEMBER,
    TEAM_LEADER,
    ADMIN,
    SUPER_ADMIN,
    FIRST_ADMIN
}

export type keyRoles = keyof Roles

export interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    role: Roles,
    agency?: mongoose.Types.ObjectId,
    token?: string,
    hash:string
}