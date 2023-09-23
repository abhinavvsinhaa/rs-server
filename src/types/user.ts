import mongoose from "mongoose";

export enum Roles {
    FIRST_ADMIN = 'first_admin',
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    TEAM_MEMBER = 'team_member',
    TEAM_LEADER = 'team_leader'
}

export interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: Roles,
    agency: mongoose.Types.ObjectId | undefined;
}