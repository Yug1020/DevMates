import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import isStrongPassword from "validator/lib/isStrongPassword.js";
import isEmail from "validator/lib/isEmail.js";
import bcrypt, { hash } from "bcrypt";

export const signUp = async(req, res) => {
    const required = [ 'firstName', 'lastName', 'email', 'gender', 'age' ]
    try{
        const {firstName, lastName, streetName, email, password, gender, age, phone, skills} = req.body
        if(!(isEmail(email))){
            res.send("Enter Valid Email")
        }
        if(!(isStrongPassword(password))){
            res.send("Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special symbol.")
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        // console.log(firstName, lastName, streetName, email, hashedpassword, gender, age, phone, skills)

        const missing = required.filter(field => !(Object.keys(req.body)).includes(field))
        if(missing.length !== 0){
            return res.send(missing + " is required to signing in")
        }
        // console.log("user", req.body)

        const new_user = new User({
            firstName, lastName, streetName, email, password: hashedpassword, gender, age, phone, skills
        })
        await new_user.save()
        return res.status(201).send("successfully added new user on database")
    } catch (error) {
        return res.status(400).send("Something is wrong: "+ error.message)
    }
}