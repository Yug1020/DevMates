import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const profile = async(req, res) => {
    try{
        const token = req.cookies.auth_token
        if(!token){
            throw new Error()
        }
        const decoded = await jwt.verify(token, process.env.secretKey)
        const cursor = await User.findById(decoded.user_id)
        const { firstName, email, gender, age, phone, skills } = cursor
        const filteredUserInfo = { firstName, email, gender, age, phone, skills }        
        res.send(filteredUserInfo)
    }catch(err){
        res.status(404).send("User must loggedin first")
    }
}