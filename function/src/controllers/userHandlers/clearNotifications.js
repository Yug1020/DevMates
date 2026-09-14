import express from "express";
import { Bell } from "../../models/Bell.js";

export const clearNotifications = async(req, res) => {
    const user = req.user;
    try {
        await Bell.findOneAndDelete({userId: user._id});

        return res.status(200).send("clear all notifications");
        
    } catch (error) {
        return res.status(400).send("Something is wrong");
    }
}