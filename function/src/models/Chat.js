import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    // A chat document represents one direct conversation between exactly two users.
    participants: {
      type: [{ type: mongoose.ObjectId, ref: "User", required: true }],
      required: true,
    },
    chats: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

export const Chat = mongoose.model("Chat", chatSchema);
