import express from "express";
import { ConnectionRequest } from "../../models/connectionRequest.js";
import { User } from "../../models/user.js";



export const sendReq = async(req, res) => {
    try{
    const fromRequest = req.user._id;
    const toRequest = req.params.toUserId;
    const sentStatus = req.params.sentStatus;
    
    const isGoal = req.user.goal;
    if(!isGoal){
        return res.status(403).send("Add goal")
    }

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
        return res.status(200).send("request already send");
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
        return res.status(400).send("something is wrong, " + error)
    }
}



