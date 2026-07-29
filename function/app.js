import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { signUp } from "./src/controllers/signUp.js";

const app = express()

async function main(){

try {

    await mongoose.connect(process.env.MONGODB)

    console.log("successfully connected")   
    
    
    app.post(/^\/signup$/, signUp)
    
    // app.use("/", (req, res) => {res.send("successfully live on 5375")})
    
    app.listen(5375, console.log("successfully live on 5375"))

    }catch (error) {
        console.log(error)
    }
}main()