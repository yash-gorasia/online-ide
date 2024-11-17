import express from 'express';
import {
    getFileTree
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/files", getFileTree);

export default router;