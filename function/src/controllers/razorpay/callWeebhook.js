import {validateWebhookSignature} from 'razorpay/dist/utils/razorpay-utils.js';
import { Payments } from '../../models/Payments.js';
import { User } from '../../models/user.js';

export const callWeebhook = async(req, res) => {
        const webhookBody = req.body;
        const webhookSignature = req.get("X-Razorpay-Signature")
    try {
        const isWeebhookValid = validateWebhookSignature(
            JSON.stringify(webhookBody), 
            webhookSignature, 
            process.env.Razor_PAY_WEBHOOK_SECRET
        );

        if(!isWeebhookValid){
            return res.status(400).json({msg:"weebhook signature is invalid"})
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payments.findOne({ paymentId: paymentDetails.order_id});

        payment.status = paymentDetails.status;
        await payment.save();
        console.log("payment status", payment.status)

        const user = await User.findById(paymentDetails.userId);
        user.isPremium = true
        await user.save()
        
        res.status(200).send("payment status", payment.status)

    } catch (error) {
        res.status(400).send("something is wrong")
    }
}
