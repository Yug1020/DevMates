import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const profile = async(req, res) => {
    try{
        const userData = req.user
        const { firstName, lastName, email, gender, age, phone, skills } = userData
        const filteredUserInfo = { firstName, lastName, email, gender, age, phone, skills }        
        res.send(filteredUserInfo)
    }catch(err){
        res.status(404).send("User must loggedin first")
    }
}