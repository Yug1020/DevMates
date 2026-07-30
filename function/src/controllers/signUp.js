import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.js"

export const signUp = async(req, res) => {
    try{
        const user = req.body
        console.log(user)
        const new_user = new User(user) 
        await new_user.save()
        res.send("successfully added new user on database")
    }catch(err){
        res.status(400).send("Something is wrong")
    }   
}