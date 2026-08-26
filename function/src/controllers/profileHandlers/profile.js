import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";

export const profile = async(req, res) => {
    try{
        const userData = req.user
        const filteredUserInfo = { firstName:userData.firstName, lastName:userData.lastName, email:userData.email, gender:userData.gender, age:userData.age, phone:userData.phone, photoURL:userData.photoURL, skills:userData.skills }        
        res.send(filteredUserInfo)
    }catch(err){
        res.status(404).send("User must loggedin first")
    }
}