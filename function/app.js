import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authRoute } from "./src/route/authRoute.js";
import { userRoute } from "./src/route/userRoute.js";
import { profileRoute } from "./src/route/profileRoute.js";
import { connectionReqRoute } from "./src/route/connectionReqRoute.js";


import dotenv from "dotenv";
dotenv.config();


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

async function main(){

app.use(express.json())
app.use(cookieParser())

//only routes without restriction
app.use("/", authRoute);

app.use("/user", userRoute);
app.use("/user/profile", profileRoute);
app.use("/connections", connectionReqRoute);




try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected to DB")   
    app.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
        console.log(error)
}
}main()