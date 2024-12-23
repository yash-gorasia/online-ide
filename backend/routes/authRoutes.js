import express from 'express';
import { googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleLogin);

export default router;