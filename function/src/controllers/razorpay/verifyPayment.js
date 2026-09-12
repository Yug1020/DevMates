import express from "express";
import { Payments } from "../../models/Payments.js";

export const verifyPayment = async(req, res) => {
    const user = req.user
    try {
        const payment = await Payments.findOne({userId:user._id})

        const {orderId, status, method} = payment;
        const payload = {orderId, status, method}

        if(user.isPremium){
            return res.status(200).send({payload, isPremium:true})
        }else{
            return res.status(404).send("User is not premium")
        }

    } catch (error) {
        return res.status(400).send("something is wrong")
    }
}