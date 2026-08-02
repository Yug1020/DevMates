import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const isMail = await User.findOne({email});

        if(isMail.length === 0){res.send("Invalid credentials")}
        
        const match = await bcrypt.compare(password, isMail.password);

        if(match){
            res.send("Login Successfully")
        }else{
            res.send("Invalid credentials")
        }
           
    }catch(err){
        res.send(err.message)
    }
}