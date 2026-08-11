import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { authRoute } from "./src/route/authRoute.js";
import { userRoute } from "./src/route/userRoute.js";
import { profileRoute } from "./src/route/profileRoute.js";
import { connectionReqRoute } from "./src/route/connectionReqRoute.js";

import { update } from "./src/controllers/update.js";
import { del_profile } from "./src/controllers/del_profile.js";
import { profile } from "./src/controllers/profile.js"
import { authHandler } from "./src/middlewares/authHandler.js"
import dotenv from "dotenv";
dotenv.config();

const app = express()

async function main(){

app.use(express.json())
app.use(cookieParser())

//only routes without restriction
app.use("/", authRoute);

app.use("/user", userRoute);
app.use("/user/profile", profileRoute);
app.use("/connectionRequest", connectionReqRoute);




try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected to DB")   
    app.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
        console.log(error)
}
}main()