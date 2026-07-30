import { User } from "../models/user.js"
import mongoose from "mongoose"

export const feed = async(req, res) => {
    try{
        const req_email = req.body
        console.log("virat mailID", req_email)
        const allUser = await User.find({email:"viratkohli@gmail.com"})
        if(allUser.length === 0){
            res.send("No user found")
        }else{
            console.log(allUser)
            res.send("Succefully got all users")
        }
    }catch(err){
        res.status(404).res.send("Something went wrong")
    }
}