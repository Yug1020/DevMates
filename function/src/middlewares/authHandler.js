import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authHandler = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token
        if(!token){
            throw new Error()
        }
        const decoded = await jwt.verify(token, process.env.secretKey)
        const cursor = await User.findById(decoded.user_id)
        req.user = cursor
        next()
    } catch (error) {
        res.status(400).send("Error pls login first")
    }
}