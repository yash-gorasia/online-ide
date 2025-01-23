import express from 'express';
import {
    getFileTree,
    deleteFileOrFolder,
    createFileOrFolder,
    renameFileOrFolder,
    writeToFile
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/getFiles/:userId", getFileTree);
router.post("/createFile", createFileOrFolder);
router.post("/writeFile", writeToFile);
router.delete("/deleteFile/:id", deleteFileOrFolder);
router.put("/renameFile", renameFileOrFolder);

export default router;