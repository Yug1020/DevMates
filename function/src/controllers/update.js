import mongoose from "mongoose";
import { User } from "../models/user.js";

export const update = async(req, res) => {
    const editable = ["streetName", "phone", "photoURL", "skills"]
    try {
        const query = req.user
        const changes = req.body
        
        const isValid = Object.keys(changes).every(item => editable.includes(item))

        if(!(isValid)){
            return res.send("selected field is not allowed to update")
        }

        if(!query){
            return res.status(404).send("User doesn't exist")
        }else{
            const updated_doc = await User.findByIdAndUpdate(query, changes, {returnDocument: "before"})
            await console.log(updated_doc)
            res.send("Successfully upgraded user profile")
        }

    } catch(error){
        res.send("Something went wrong " + error.message)
    }
}