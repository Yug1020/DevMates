import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { sendReq } from "../controllers/networkHandler/sendReq.js";
import { recevReq } from "../controllers/networkHandler/recevReq.js";
import { sentList } from "../controllers/networkHandler/sentList.js";
import {reqList} from "../controllers/networkHandler/reqList.js"
import { connectionList } from "../controllers/networkHandler/connectionList.js";


export const connectionReqRoute = express.Router();

connectionReqRoute.post("/send/:sentStatus/:toUserId", authHandler, sendReq); 
connectionReqRoute.post("/received/:receivedStatus/:fromUserId", authHandler, recevReq);
connectionReqRoute.get("/sentList", authHandler, sentList);
connectionReqRoute.get("/receivedList", authHandler, reqList)
connectionReqRoute.get("/list", authHandler, connectionList);