import express from "express";
import mongoose from "mongoose";
import { signUp } from "./src/controllers/signUp.js";
import { login } from "./src/controllers/login.js";
import { feed } from "./src/controllers/feed.js";
import { update } from "./src/controllers/update.js";
import { del_profile } from "./src/controllers/del_profile.js";
import dotenv from "dotenv";
dotenv.config();

const app = express()

async function main(){

app.use(express.json())
app.post(/^\/signup$/, signUp)
app.post(/^\/login$/, login)
app.get(/^\/feed$/, feed)
app.patch("/update_profile/:profile_id", update)
app.delete(/^\/delete_profile$/, del_profile)
try {
    await mongoose.connect(process.env.MONGODB)
    console.log("successfully connected to DB")   
    app.listen(5375, console.log("successfully live on 5375"))
}
catch(error){
        console.log(error)
}
}main()