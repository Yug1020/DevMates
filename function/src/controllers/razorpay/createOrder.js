import express from "express";
import { razorpayInstance } from "../../utils/razorpayInstance.js";


export const createOrder = async(req, res) => {
    const user = req.user;
    try {
        const orderReq = await razorpayInstance.orders.create({
            amount: 1000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName: user.firstName,
                lastName: user.lastName,
                email:user.email,
                phone:user.phone
            }
        })
        console.log("user", user)
        console.log("orderReq", orderReq)
        res.status(200).json({orderReq, "key":process.env.Razor_PAY_API_KEY})

    } catch (error) {
        res.status(400).send("Something is wrong", error)
    }

}