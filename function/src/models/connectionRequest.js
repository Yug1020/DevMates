import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionRequestSchema = new mongoose.Schema(
    {
        fromRequest: { type: mongoose.ObjectId },
        toRequest: { type: mongoose.ObjectId },
        status: { type: String, enum:{ values:["pass", "connect", "ignored"]}}
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
  next()
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export { ConnectionRequest };