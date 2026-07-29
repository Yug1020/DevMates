import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.js"

const app = express();

export const signUp = async(req, res) => {
    try{
        const new_user = new User({
            firstName: "Virat",
            lastName: "kohli",
            email: "viratkohli@gmail.com",
            gender: "Male",
            age: 21
            }            
        ) 
        await new_user.save()
        res.send("successfully added new user on database")
    }catch(err){
        res.status(400).send("Something is wrong")
    }   
}
