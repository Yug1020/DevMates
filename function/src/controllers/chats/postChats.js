import { Chat } from "../../models/Chat.js";
import { User } from "../../models/user.js";
import mongoose from "mongoose";

export const saveChats = async (req, res) => {
  try {
    const senderId = req.user?._id;
    // receiver_id is accepted temporarily for compatibility with the original API.
    const requestedReceiverId = req.body.receiverId ?? req.body.receiver_id;
    const text = typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (typeof requestedReceiverId !== "string" || !requestedReceiverId.trim() || !text) {
      return res.status(400).json({ error: "receiverId and message are required." });
    }

    const receiverIdString = requestedReceiverId.trim();
    if (!mongoose.isObjectIdOrHexString(receiverIdString)) {
      return res.status(400).json({ error: "receiverId is invalid." });
    }

    const receiverId = new mongoose.Types.ObjectId(receiverIdString);
    if (receiverId.equals(senderId)) {
      return res.status(400).json({ error: "You cannot send a message to yourself." });
    }

    if (text.length > 2000) {
      return res.status(400).json({ error: "A message cannot exceed 2000 characters." });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ error: "Receiver not found." });
    }

    let chatBox = await Chat.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    if (!chatBox) {
      chatBox = new Chat({ participants: [senderId, receiverId] });
    }

    chatBox.chats.push({ senderId, text });
    await chatBox.save();

    const message = chatBox.chats[chatBox.chats.length - 1];
    return res.status(201).json({ message });

  } 
  catch (error) {
    console.error("Unable to save chat:", error);
    return res.status(500).json({ error: "Unable to send message." });
  }
};
