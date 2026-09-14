import express from "express";
import { Bell } from "../../models/Bell.js";

export const notifications = async(req, res) => {
    const user = req.user;
    try {
        const bell = await Bell.findOne({userId: user._id});
        const payload = bell?.messages || [];

        return res.status(200).json(payload);
    } catch (error) {
        res.status(400).send("something is wrong")
        console.error("Error in notifications handler:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}