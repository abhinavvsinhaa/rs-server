import express from 'express'
import {registerAgency} from '../controllers';
export const agencyRouter = express.Router();

agencyRouter
    .post('/register', registerAgency)