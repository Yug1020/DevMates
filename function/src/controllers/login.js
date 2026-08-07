import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const isMail = await User.findOne({email});

        if(!isMail){res.send("Invalid credentials")}
        
        // const match = await bcrypt.compare(password, isMail.password);
        const match = await isMail.verifyPassword(password)

        // const payload = { user_id : isMail._id}

        // const token = jwt.sign(payload, process.env.secretKey, {expiresIn: "1hr"}) //This expire time is for token expiry time in server

        if(match){
            const cookie = res.cookie("auth_token", isMail.generateAuthtoken(), // isMail.generateAuthtoken() is the way to generate user token using mongoose methods
                {
                    httpOnly: true, //Prevents client-side JS from reading the cookie
                    secure: true,   //Ensures the cookie is only sent over HTTPS (useful for production)
                    maxAge: 7 * 86400 //7 days of expire time (3 hrs * 86400(sec in a day))  
                }
            )
            res.send("Login Successfully")
        }else{
            res.send("Invalid credentials")
        }

    }catch(err){
        res.send("Somthing is wrong")
    }
}