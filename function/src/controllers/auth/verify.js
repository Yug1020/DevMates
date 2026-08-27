import express from "express";

export const verify = async(req, res) => {
    try{
        const userData = req.user
        if (userData){
            res.status(200).send("verified")
        }
    }catch(err){
        res.status(401).send("Unauthorized")
    }
}