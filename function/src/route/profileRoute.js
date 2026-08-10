import express from "express";
import { authHandler } from "../middlewares/authHandler.js";
import { profile } from "../controllers/profile.js";
import { update } from "../controllers/update.js";
import { del_profile } from "../controllers/del_profile.js";
import { editPassword } from "../controllers/editPassword.js";


export const profileRoute = express.Router();

profileRoute.get("/", authHandler, profile);
profileRoute.patch(/^\/update$/,authHandler, update);
profileRoute.delete(/^\/delete$/,authHandler, del_profile);
profileRoute.patch(/^\/edit_password$/, authHandler, editPassword)
