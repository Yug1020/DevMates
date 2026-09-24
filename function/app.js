import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { checkGoal } from "./src/utils/checkGoal.js";
import { initializeSocket } from "./src/utils/socket.js";
import http from "http";

import { authRoute } from "./src/route/authRoute.js";
import { userRoute } from "./src/route/userRoute.js";
import { profileRoute } from "./src/route/profileRoute.js";
import { connectionReqRoute } from "./src/route/connectionReqRoute.js";
import { razorpay } from "./src/route/razorpay.js";
import { chatRoute } from "./src/route/chatRoute.js";

import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
const server = http.createServer(app);
initializeSocket(server)

async function main(){
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}))
app.use(cookieParser())

//only routes without restriction
app.use("/", authRoute);

app.use("/user", userRoute);
app.use("/user/profile", profileRoute);
app.use("/connections", connectionReqRoute);
app.use("/razorpay", razorpay);
app.use("/chat", chatRoute);

try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected to DB")   
    checkGoal.start();
    console.log(`Goal checker scheduled for ${checkGoal.nextDate().toISO()}`);
    server.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
    console.log(error)
}
}main()
