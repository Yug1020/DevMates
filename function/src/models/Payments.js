import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    userId: { type: mongoose.ObjectId, ref: "User", required: true },
    paymentStatus: { type: String, required: true },
    status: { type: String }
}, { timestamps: true });

const Payments = mongoose.model("Payments", paymentSchema);

export { Payments };