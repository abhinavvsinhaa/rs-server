import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' })

const mongo_uri: string | undefined = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        if (mongo_uri == undefined) throw new Error('Mongo URI cannot be undefined');

        await mongoose.connect(mongo_uri);
        console.log('DB successfully connected!');
    } catch (error) {
        console.error(error);
    }
}