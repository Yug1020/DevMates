import express from "express";
import { signUp } from "../controllers/signUp.js";
import { login } from "../controllers/login.js";
import { authHandler } from "../middlewares/authHandler.js";
import { logout } from "../controllers/logout.js";
import { verify } from "../controllers/verify.js";

export const authRoute = express.Router()

authRoute.post(/^\/signup$/, signUp);
authRoute.post(/^\/login$/, login);
authRoute.post(/^\/logout$/,authHandler, logout);
authRoute.use(/^\/verify$/,authHandler, verify);