import express from "express";

export const logout = (req, res) => {
    const token = req.cookies.auth_token

    try {
        if(token.length === 0){
            throw new Error()
        }
        else{
            //method_1:- This method clear the mentioned cookie by setting time to zero (fun fact:- 1st Jan 1970)
            // res.clearCookie("auth_token");

        //method_2:- This is manual way to set cookie time to expire (fun fact:- method_1 internally use the method_2)
            
            res.cookie("auth_token", "", 
                {
                    expires: new Date(Date.now()),
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