import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";

export const profile = async(req, res) => {
    try{
        const userData = req.user
        const filteredUserInfo = { userId:userData._id, firstName:userData.firstName, lastName:userData.lastName, streetName:userData.streetName,email:userData.email, gender:userData.gender, age:userData.age, phone:userData.phone, photoURL:userData.photoURL, skills:userData.skills, profession: userData.profession, goal: userData.goal, goalDeadline: userData.goalDeadline, isPremium: userData.isPremium }       
        res.send(filteredUserInfo)
    }catch(err){
        res.status(404).send("User must loggedin first")
    }
}