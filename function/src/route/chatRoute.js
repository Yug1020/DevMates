import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { getChats } from "../controllers/chats/getChats.js";
import { saveChats } from "../controllers/chats/postChats.js";

export const chatRoute = express.Router();

chatRoute.get("/prevChats", authHandler, getChats);
chatRoute.post("/sendTxt", authHandler, saveChats);