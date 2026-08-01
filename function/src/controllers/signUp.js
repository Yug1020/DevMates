import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.js"

export const signUp = async(req, res) => {
    const required = [ 'firstName', 'lastName', 'email', 'gender', 'age' ]
    try{
        const user = req.body
        
        const missing = required.filter(field => !(Object.keys(user)).includes(field))
        if(missing.length !== 0){
            return res.send(missing + " is required to signing in")
        }
        console.log("missing:-", missing)
        console.log("user", user)

        const new_user = new User(user)
        await new_user.save()
        return res.status(201).send("successfully added new user on database")
    } catch (error) {
        return res.status(400).send("Something is wrong: "+ error.message)
    }
}