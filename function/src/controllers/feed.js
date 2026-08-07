import { User } from "../models/user.js"
import mongoose from "mongoose"

export const feed = async(req, res) => {
    const limit = ["firstName", "lastName", "email", "gender", "age", "phone", "skills"]
    
    try{
        const req_email = req.body
        const allUser = await User.find(req_email)

        if(allUser.length === 0){
            res.send("No user found")
        }

        //filtering cursor before sending response
        const result = allUser.map((user) => {
            const filteredUser = {};
                    limit.forEach((key) => {
                if (user[key] !== undefined) {
                    filteredUser[key] = user[key];
                }
            });
            return filteredUser;
        });

        res.send(result)

    }catch(err){
        res.status(404).send("Something went wrong")
    }
}