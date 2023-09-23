import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './config/db';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port: string = process.env.PORT || '8080';

app.get('/', (req: Request, res: Response) => {
    res.send('Rescue sync server up and running!')
})

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
    connectDB();
})