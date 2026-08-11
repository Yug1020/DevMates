import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { sendReq } from "../controllers/sendReq.js";

export const connectionReqRoute = express.Router();

connectionReqRoute.post("/:status/:toUserId", authHandler, sendReq); 