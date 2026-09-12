import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

    paymentId:{type:String, require:true},
    userId:{type:mongoose.ObjectId, ref:"User", require:true},
    paymentStatus: {type:String, require:true}
}, {timestamps:true})

const Payments = mongoose.model("Payments", paymentSchema);

export { Payments };