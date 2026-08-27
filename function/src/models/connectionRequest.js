import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionRequestSchema = new mongoose.Schema(
  {
    fromRequest: { type: mongoose.ObjectId , ref:"User"},
    toRequest: { type: mongoose.ObjectId, ref:"User" },
    sentStatus: { type: String, enum:{ values:["pass","connect", "ignore"]}},
    receivedStatus: {type: String, enum:{ values:[ "pending", "accept", "reject"] }, default:"pending" },
    createdAt: { type: Date, default: () => 
      {
        const now = new Date();
        // Add 5.5 hours in milliseconds (5.5 * 60 * 60 * 1000)
        const istOffset = 5.5 * 60 * 60 * 1000; 
        return new Date(now.getTime() + istOffset);
      }
    },
    updatedAt: { type: Date, default: () => 
      {
        const now = new Date();
        // Add 5.5 hours in milliseconds (5.5 * 60 * 60 * 1000)
        const istOffset = 5.5 * 60 * 60 * 1000; 
        return new Date(now.getTime() + istOffset);
      }
    }    
  }
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