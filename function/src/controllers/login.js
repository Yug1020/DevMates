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

        if(!isMail){
            return res.send("Invalid credentials")
        }
        
        //Mongoose method of password verification
        const match = await isMail.verifyPassword(password)

    //another way to verify password
        // const match = await bcrypt.compare(password, isMail.password);  
        
    //another way of token generation
        // const payload = { user_id : isMail._id}
        // const token = jwt.sign(payload, process.env.secretKey, {expiresIn: "1hr"}) //This expire time is for token expiry time in server        

        
        if(match){
            //isMail.generateAuthtoken() is Mongoose method of token generation
            const cookie = res.cookie("auth_token", isMail.generateAuthtoken(), // isMail.generateAuthtoken() is the way to generate user token using mongoose methods
                {
                    httpOnly: true, //Prevents client-side JS from reading the cookie
                    secure: true,   //Ensures the cookie is only sent over HTTPS (useful for production)
                    maxAge: 7 * 86400 //7 days of expire time (3 hrs * 86400(sec in a day))  
                }
            )
            return res.send("Login Successfully")
        }else{
            return res.send("Invalid credentials")
        }

    }catch(err){
        res.send("Somthing is wrong")
    }
}