import mongoose from "mongoose";
import { User } from "../models/user.js";

export const update = async(req, res) => {
    try {
        const query = req.body._id
        const changes = req.body
        console.log(query)
        const updated_doc = await User.findByIdAndUpdate(query, changes, {returnDocument: "after"})
        if(updated_doc.length === 0){
            res.status(404).res.send("User doesn't exist")
        }else{
            await console.log(updated_doc)
            res.send("Successfully upgraded user profile")
        }
    } catch(error){
        res.send("Something went wrong")
    }
}