import express from "express";

export const logout = (req, res) => {
    const token = req.cookies.auth_token

    try {
        if(token.length === 0){
            throw new Error()
        }
        else{

            res.cookie("auth_token", "", 
                {
                    expires: new Date(0),
                    httpOnly: true, //Prevents client-side JS from reading the cookie
                    secure: true,   //Ensures the cookie is only sent over HTTPS (useful for production) 
                }                   
            )
            return res.status(200).send("Logout Successfully");
        }
    } catch (error) {
        return res.status(404).send("Somthing went wrong");
    }
}