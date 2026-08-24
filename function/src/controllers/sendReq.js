import express from "express";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";


const USER_INFO = ["firstName", "lastName", "email", "gender", "age", "phone", "photoURL", "skills"]

export const sendReq = async(req, res) => {
    try{
    const fromRequest = req.user._id;
    const toRequest = req.params.toUserId;
    const sentStatus = req.params.sentStatus;

    const real_user = await User.findById(toRequest)

    if(!real_user){
        return res.status(404).json("User doesn't exist")
    }

    const reqExist = await ConnectionRequest.findOne({
        $or:
        [
            {fromRequest, toRequest},
            {fromRequest: toRequest, toRequest: fromRequest}
        ]
    })
    if(reqExist && reqExist.sentStatus !== sentStatus && reqExist.receivedStatus === "pending"){
        const cursor = await ConnectionRequest.findOneAndUpdate(reqExist._id, {sentStatus: sentStatus});

        return res.send("request has been updated")
    }

    if(reqExist){
        return res.send("request already send");
    }

    const data = new ConnectionRequest({
        fromRequest: fromRequest,
        toRequest: toRequest,
        sentStatus: sentStatus
        // sentStatus: sentStatus        
    })
    
    await data.save()

    res.json(data)
    }catch(error){
        res.status(400).send("something is wrong, " + error)
    }
}

export const recevReq = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const receivedStatus = req.params.receivedStatus;
        const fromId = req.params.fromUserId;

        const query = {fromRequest: fromId, toRequest: loggedInUser._id, sentStatus: "connect"}; //, receivedStatus: "pending"

        const reqExist = await ConnectionRequest.findOneAndUpdate(query, {receivedStatus: receivedStatus}, {returnDocument:"after"}).populate('fromRequest', USER_INFO)

        const data = reqExist.fromRequest
        
        if(!reqExist){
            throw new Error() //Fix the or show the real status
        }

        res.json(data)

    } catch (error) {
        res.send("Something is wrong")
    }
}

export const connectionList = async(req, res) => {
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