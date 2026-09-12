import express from "express";
import { razorpayInstance } from "../../utils/razorpayInstance.js";
import { Payments } from "../../models/Payments.js";


export const createOrder = async(req, res) => {
    const user = req.user;
    try {
        const orderReq = await razorpayInstance.orders.create({
            amount: 1000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                userId: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        })

        const payload = {
            orderId: orderReq.id,
            userId: user._id,
            status: orderReq.status
        }

        const new_doc = new Payments(payload)
        await new_doc.save()

        res.status(200).json({orderReq, "key":process.env.Razor_PAY_API_KEY})

    } catch (error) {
        res.status(400).send("Something is wrong", error)
    }

}