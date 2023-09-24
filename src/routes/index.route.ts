import express from 'express'
import authRouter from "./auth.route";
import { agencyRouter } from "./agency.route";

const router = express.Router();

router.use('/auth',authRouter)
router.use('/agency', agencyRouter);

export default router