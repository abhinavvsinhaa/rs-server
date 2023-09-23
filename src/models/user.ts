import mongoose, { Schema, Document, Model, model } from "mongoose";
import { IUser, Roles } from "../types/user";

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        },
        lowercase: true,
        unique: true,
    },
    roles: {
        type: String,
        enum: Roles,
        required: true,
    },
    agency: {
        type: mongoose.Types.ObjectId,
        ref: 'Agency',
    }
})

export const User = model<IUser>('User', userSchema);
