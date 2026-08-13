import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionRequestSchema = new mongoose.Schema(
    {
        fromRequest: { type: mongoose.ObjectId , ref:"User"},
        toRequest: { type: mongoose.ObjectId, ref:"User" },
        sentStatus: { type: String, enum:{ values:["pass", "connect", "ignored"]}},
        receivedStatus: {type: String, enum:{ values:[ "pending", "accept", "reject"] }, default:"pending" }
    }, { timestamps: true }
)

connectionRequestSchema.index({fromRequest: 1, toRequest: 1});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // 1. Use .equals() to compare ObjectIds
  if (connectionRequest.fromRequest.equals(connectionRequest.toRequest)) {
    // 2. Throw an error or pass it to next()
    throw new Error("Cannot send connection request to yourself!");
  }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export { ConnectionRequest };