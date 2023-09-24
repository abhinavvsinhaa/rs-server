import { Schema, Types, model } from "mongoose";
import {IAgency, ITeam} from "../types/agency.types";

const teamSchema = new Schema<ITeam>({
    members: {
        type: [Types.ObjectId],
        ref: 'User',
    },
    leader: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const agencySchema = new Schema<IAgency>({
    name: {
        type: String,
        required: true
    },
    members: {
        type: [Types.ObjectId],
        ref: 'User'
    },
    teams: [teamSchema],
    central: {
        type: Boolean,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        },
        unique: true
    },
    contactNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Please enter a valid mobile number'
        },
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected']
    }
})

export const AgencyModel = model<IAgency>('Agency', agencySchema);