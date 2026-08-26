import express from "express";
import { User } from "../../models/user.js";
import bcrypt from "bcrypt";
import isStrongPassword from "validator/lib/isStrongPassword.js";

export const editPassword = async(req, res) => {
    try {
        const query = req.user;
        const changes = req.body;

        const old_password = changes.old_password;
        const new_password = changes.password;

        const match = await bcrypt.compare(old_password, query.password)
        
        if(!match){
            return res.send("Invalid credintials")
        }

        if(!isStrongPassword(new_password)){
            return res.send("Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special symbol.")
        }

        const hashedpassword = await bcrypt.hash(new_password, 10);
        
        const cursor = await User.findByIdAndUpdate(query._id, {password: hashedpassword})
        return res.status(200).send("Successfully updated user")

    } catch (error) {
        return res.status(400).send("Something is wrong")
    }

}