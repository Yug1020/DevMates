import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: mongoose.ObjectId, ref: "User", required: true },
    status: { type: String },
    method: { type: String }
}, { timestamps: true });

const Payments = mongoose.model("Payments", paymentSchema);

export { Payments };