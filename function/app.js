import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { signUp } from "./src/controllers/signUp.js";
import { login } from "./src/controllers/login.js";
import { feed } from "./src/controllers/feed.js";
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
app.post(/^\/signup$/, signUp)
app.post(/^\/login$/, login)

//All following routes are restricted and the authHandler is compulsory.
app.get(/^\/profile$/, authHandler, profile)
app.get(/^\/feed$/, authHandler, feed)
app.patch("/update_profile/:profile_id",authHandler, update)
app.delete(/^\/delete_profile$/,authHandler, del_profile)

try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected to DB")   
    app.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
        console.log(error)
}
}main()