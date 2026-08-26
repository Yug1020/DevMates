import express from "express";
import { feed } from "../controllers/userHandlers/feed.js";
import { authHandler } from "../middlewares/authHandler.js"

export const userRoute = express.Router();

userRoute.get(/^\/feed$/, authHandler, feed);