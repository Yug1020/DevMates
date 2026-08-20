import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.js";
import isStrongPassword from "validator/lib/isStrongPassword.js";
import isEmail from "validator/lib/isEmail.js";
import bcrypt, { hash } from "bcrypt";

export const signUp = async(req, res) => {
    const required = [ 'firstName', 'lastName', 'email', 'password', 'gender', 'age' ]
    try{
        const {firstName, lastName, streetName, username, email, password, gender, age, phone, skills, photoURL, bio} = req.body
        if(!(isEmail(email))){
            return res.status(400).send("Enter Valid Email")
        }
        else if(!(isStrongPassword(password))){
            return res.status(400).send("Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special symbol.")
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const missing = required.filter(field => !(Object.keys(req.body)).includes(field))
        if(missing.length !== 0){
            return res.status(400).send(missing.join(", ") + " is required to sign up")
        }

        const newUserData = {
            firstName,
            lastName,
            streetName: streetName || username,
            email,
            password: hashedpassword,
            gender,
            age,
            phone,
            skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : [])
        }
        if (photoURL) newUserData.photoURL = photoURL;
        if (bio) newUserData.bio = bio;

        const new_user = new User(newUserData)
        await new_user.save()
        return res.status(201).send("successfully added new user on database")
    } catch (error) {
        return res.status(400).send("Something is wrong: "+ error.message)
    }
}