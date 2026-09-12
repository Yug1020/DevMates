import express from "express";
import { createOrder } from "../controllers/razorpay/createOrder.js";
import { authHandler } from "../middlewares/authHandler.js";
import { callWeebhook } from "../controllers/razorpay/callWeebhook.js";
import { verifyPayment } from "../controllers/razorpay/verifyPayment.js";

export const razorpay = express.Router();

razorpay.post(/^\/createOrder$/, authHandler, createOrder);
razorpay.post(/^\/webhook$/, callWeebhook);
razorpay.get(/^\/verifyPayment$/, authHandler, verifyPayment);