import express from 'express'
import {createUser, loginUser, me} from '../controllers';
import {auth} from "../middlewares/auth";

const authRouter = express.Router();

authRouter
    .post('/register',auth, createUser)
    .post('/login', loginUser)
    .get('/me',auth,me)

export default authRouter;