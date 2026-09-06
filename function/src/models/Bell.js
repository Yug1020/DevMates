import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id:  { type: mongoose.ObjectId, ref:"User", required: true },
    messages: { type: String, required: true }
}, { timestamps: true })

const Bell = mongoose.model("Bell", notificationSchema)

export {Bell};
