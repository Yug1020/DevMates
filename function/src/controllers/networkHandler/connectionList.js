import express from "express";
import { ConnectionRequest } from "../../models/connectionRequest.js";
import { User } from "../../models/user.js";

export const connectionList = async(req, res) => {
    const USER_INFO = ["firstName", "lastName", "email", "gender", "age", "phone", "photoURL", "skills", "bio"]

    try {
        const loggedInUser = req.user._id;

        const query = {$or:[{fromRequest:loggedInUser}, {toRequest:loggedInUser}], sentStatus: "connect", receivedStatus: "accept"}

        const reqExist = await ConnectionRequest.find(query).populate("fromRequest", USER_INFO).populate("toRequest", USER_INFO);

        if (!reqExist){
            throw new Error(error)
        }

        const data = reqExist.map((row) => {
            const fromIdString = row.fromRequest._id.toString();
            const loggedInString = loggedInUser.toString();
        
            if (fromIdString === loggedInString) {
                return row.toRequest;
            } else {
                return row.fromRequest;
            }
        });

        res.send(data)
    } catch (error) {
        res.status(400).send("Something is wrong")
    }
}