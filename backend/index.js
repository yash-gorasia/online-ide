import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

//utiles
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Allow request from frontend
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`server is running on ${process.env.PORT}`);
})