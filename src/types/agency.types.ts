import mongoose from "mongoose";
import { IUser } from "./user.types";
import { IResources } from "./resources.types";

export enum MissionStatus {
    ONGOING = 'ongoing',
    SUCCESSFUL = 'successful',
    UNSUCCESSFUL = 'unsuccessful',
    UPCOMING = 'upcoming'
}

export interface IResource {
    resource: mongoose.Types.ObjectId | IResources,
    quantity: number
}

export interface ITeam {
    members: Array<mongoose.Types.ObjectId> | Array<IUser>,
    leader: mongoose.Types.ObjectId | IUser,
    objective: string,
    destination: string, // store coordinates
    currentPosition: string, // for storing coordinates
    missionStatus: MissionStatus,
    resources: Array<IResource> | [],
    startDate: string,
    expectedEndDate: string | undefined,
    endDate: string | undefined 
}

export interface IAgency {
    name: string,
    members: Array<mongoose.Types.ObjectId>,
    teams: Array<ITeam>,
    central: boolean, // is it a central agency
    state: string,
    contactEmail: string,
    contactNumber: string
}