import express from "express";
import { ConnectionRequest } from "../../models/connectionRequest.js";
import { User } from "../../models/user.js";

export const recevReq = async(req, res) => {
    const USER_INFO = ["firstName", "lastName", "email", "gender", "age", "phone", "photoURL", "skills", "bio"]

    try {
        const loggedInUser = req.user;
        const receivedStatus = req.params.receivedStatus;
        const fromId = req.params.fromUserId;

        const query = {fromRequest: fromId, toRequest: loggedInUser._id, sentStatus: "connect"}; // receivedStatus: "pending"

        const reqExist = await ConnectionRequest.findOneAndUpdate(query, {receivedStatus: receivedStatus}, {returnDocument:"after"}).populate('fromRequest', USER_INFO)

        const data = reqExist.fromRequest
        
        if(!reqExist){
            throw new Error() //Fix the or show the real status
        }

        res.json(data)

    } catch (error) {
        res.status(400).send("Something is wrong")
    }
}