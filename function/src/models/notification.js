import mongoose, { mongo, Mongoose } from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id:  { type: mongoose.ObjectId , ref:"User"},
    messages: {type:[String]}
})

const Bell = mongoose.model("Bell", notificationSchema)

export {Bell};