import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { profile } from "../controllers/profileHandlers/profile.js";
import { update } from "../controllers/profileHandlers/update.js";
import { del_profile } from "../controllers/profileHandlers/del_profile.js";
import { editPassword } from "../controllers/profileHandlers/editPassword.js";


export const profileRoute = express.Router();

profileRoute.get("/", authHandler, profile);
profileRoute.patch(/^\/update$/,authHandler, update);
profileRoute.delete(/^\/delete$/,authHandler, del_profile);
profileRoute.patch(/^\/edit_password$/, authHandler, editPassword)
