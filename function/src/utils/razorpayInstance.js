import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay(
    { 
        key_id: process.env.Razor_PAY_API_KEY, key_secret: process.env.Razor_PAY_SECRET_KEY 
    }
)
