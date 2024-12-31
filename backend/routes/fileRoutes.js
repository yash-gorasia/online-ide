import express from 'express';
import {
    getFileTree,
    deleteFileOrFolder,
    createFileOrFolder
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/getFiles/:userId", getFileTree);
router.post("/createFile", createFileOrFolder);
router.delete("/deleteFile/:id", deleteFileOrFolder);

export default router;