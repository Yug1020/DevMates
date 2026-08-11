import express from "express";
import { ConnectionRequest } from "../models/connectionRequest.js";

export const sendReq = async(req, res) => {
    try{const fromRequest = req.user._id;
    const toRequest = req.params.toUserId;
    const status = req.params.status;

    const reqExist = await ConnectionRequest.findOne({
        $or:
        [
            {fromRequest, toRequest},
            {fromRequest: toRequest, toRequest: fromRequest}
        ]
    })
    if(reqExist && reqExist.status !== status){
        const cursor = await ConnectionRequest.findOneAndUpdate(reqExist._id, {status: status});

        return res.send("request has been updated")
    }

    if(reqExist){
        return res.send("request already send");
    }

    const data = new ConnectionRequest({
        fromRequest: fromRequest,
        toRequest: toRequest,
        status: status        
    })
    
    await data.save()

    res.json(data)}
    catch(error){
        res.status(400).send("something is wrong, " + error)
    }
}
