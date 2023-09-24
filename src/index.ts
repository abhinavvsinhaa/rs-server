import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './config/db';
import {getAllowedURL} from "./config/cors";
import router from "./routes/index.route";

dotenv.config();

const app: Express = express();

let corsOptions = {
    origin: getAllowedURL(),
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port: string = process.env.PORT || '8080';

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.send('Rescue sync server up and running!')
})

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
    connectDB();
})