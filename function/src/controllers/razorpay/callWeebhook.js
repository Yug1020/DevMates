import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { Payments } from '../../models/Payments.js';
import { User } from '../../models/user.js';

export const callWeebhook = async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");

        if (!webhookSignature) {
            console.error("Razorpay webhook signature header missing");
            return res.status(400).json({ msg: "Signature header missing" });
        }

        // Use raw body captured by express.json middleware for accurate HMAC verification
        const webhookPayload = req.rawBody || JSON.stringify(req.body);

        const isWebhookValid = validateWebhookSignature(
            webhookPayload,
            webhookSignature,
            process.env.Razor_PAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            console.error("Razorpay webhook signature is invalid");
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }

        const event = req.body.event;
        const paymentDetails = req.body.payload?.payment?.entity;
        const orderId = paymentDetails?.order_id || req.body.payload?.order?.entity?.order_id;

        if (!orderId) {
            console.log("No order_id found in webhook payload");
            return res.status(200).json({ msg: "Webhook received without order_id" });
        }

        const payment = await Payments.findOne({ orderId: orderId });

        if (!payment) {
            console.error(`Payment record not found for orderId: ${orderId}`);
            return res.status(404).json({ msg: "Payment record not found" });
        }

        // Update payment status in Payments document
        const currentStatus = paymentDetails?.status;
        payment.status = currentStatus;
        payment.method = paymentDetails?.method;
        await payment.save();

        console.log(`Payment status updated: orderId=${orderId}, status=${currentStatus}`);

        // Update user's isPremium status if payment is captured/successful
        const isSuccessful = currentStatus === "captured" || event === "payment.captured" || event === "order.paid";

        if (isSuccessful) {
            // Note: paymentDetails does NOT have a userId property.
            // userId comes from our database payment record (or notes if passed).
            const user = await User.findById(payment.userId);

            if (user) {
                user.isPremium = true;
                await user.save();
                console.log(`User ${user._id} upgraded to isPremium = true`);
            } else {
                console.error(`User not found for userId: ${userId}`);
            }
        }

        return res.status(200).json({
            msg: "Payment status processed successfully",
            status: payment.status
        });

    } catch (error) {
        console.error("Error in Razorpay webhook handler:", error);
        return res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
};
