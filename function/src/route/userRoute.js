import express from "express";
import { feed } from "../controllers/userHandlers/feed.js";
import { authHandler } from "../middlewares/authHandler.js";
import { notifications } from "../controllers/userHandlers/notifications.js";
import { clearNotifications } from "../controllers/userHandlers/clearNotifications.js";

export const userRoute = express.Router();

userRoute.get(/^\/feed$/, authHandler, feed);
userRoute.get(/^\/notifications$/, authHandler, notifications);
userRoute.post(/^\/clearNotification$/, authHandler, clearNotifications);