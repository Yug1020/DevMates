import mongoose from "mongoose";
import { User } from "../../models/user.js";

export const del_profile = async (req, res) => {
    const query = req.user;
    const password = req.body.password;
    try {
        const passwordVerification = await query.verifyPassword(password)
        //Above verifyPassword function is defined in User schema model

        if(!passwordVerification){
            return res.status(401).send("Invalid password")
        }

        const deleted = await User.findOneAndDelete(query);
        if(!deleted){
            return res.status(404).send("User not found")
        }else{
            // Deleting the account also invalidates the current login session.
            res.clearCookie("auth_token", {
                httpOnly: true,
                secure: true,
            });
            return res.send("successfully deleted user profile")
        }
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
}
