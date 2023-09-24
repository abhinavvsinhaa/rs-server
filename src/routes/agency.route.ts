import express from 'express'
import {registerAgency, getAllAgencies} from '../controllers';
import {auth} from "../middlewares/auth";
export const agencyRouter = express.Router();

agencyRouter
    .get('/', auth, getAllAgencies)
    .post('/register', registerAgency)