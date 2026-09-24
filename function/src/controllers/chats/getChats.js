import { Chat } from "../../models/Chat.js";
import mongoose from "mongoose";

export const getChats = async (req, res) => {
  try {
    // GET request values belong in the query string, not in req.body.
    const requestedReceiverId = req.query.targetId;
    const senderId = req.user?._id;

    if (typeof requestedReceiverId !== "string" || !requestedReceiverId.trim()) {
      return res.status(400).json({ error: "receiver doesn't exist" });
    }

    const receiverIdString = requestedReceiverId.trim();
    if (!mongoose.isObjectIdOrHexString(receiverIdString)) {
      return res.status(400).json({ error: "receiver doesn't exist." });
    }

    const receiverId = new mongoose.Types.ObjectId(receiverIdString);
    if (receiverId.equals(senderId)) {
      return res.status(400).json({ error: "You cannot open a chat with yourself." });
    }

    const chatBox = await Chat.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    }).select("chats");
    //select only return "chats" and "objectId"(default) field in "Chat" document inside chatBox.

    // bcoz of "?? []" user can open chatbox with no msg in inbox
    return res.status(200).json({ messages: chatBox?.chats ?? [] });
  } catch (error) {
    return res.status(400).send("something is wrong");
  }
};
