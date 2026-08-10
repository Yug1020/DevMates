import mongoose from "mongoose";
import { User } from "../models/user.js";

export const del_profile = async (req, res) => {
    const query = req.user;
    console.log(query)
    try {
        const deleted = await User.findOneAndDelete(query);
        console.log(deleted)
        if(deleted === null){
            res.status(404).send("User not found") 
        }else{
            console.log(deleted)
            res.send("successfully deleted user profile")
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
}