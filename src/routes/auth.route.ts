import express from 'express'
import { createUser,loginUser } from '../controllers/user.controller';
import {auth} from "../middlewares/auth";

const authRouter = express.Router();

authRouter
    .post('/register',auth, createUser)
    .post('/login', loginUser)

export default authRouter;