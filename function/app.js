import express from "express";
import mongoose from "mongoose";
import { signUp } from "./src/controllers/signUp.js";
import { feed } from "./src/controllers/feed.js";
import dotenv from "dotenv";
dotenv.config();

const app = express()

async function main(){

app.use(express.json())

app.post(/^\/signup$/, signUp)

app.get(/^\/feed$/, feed)

try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected")   
    app.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
        console.log(error)
}
}main()