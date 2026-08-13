import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { sendReq, recevReq, connectionList } from "../controllers/sendReq.js";


export const connectionReqRoute = express.Router();

connectionReqRoute.post("/send/:sentStatus/:toUserId", authHandler, sendReq); 
connectionReqRoute.post("/received/:receivedStatus/:fromUserId", authHandler, recevReq);
connectionReqRoute.get("/list", authHandler, connectionList);