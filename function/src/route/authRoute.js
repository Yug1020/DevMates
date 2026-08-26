import express from "express";
import { signUp } from "../controllers/auth/signUp.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { verify } from "../controllers/auth/verify.js";
import { authHandler } from "../middlewares/authHandler.js";

export const authRoute = express.Router()

authRoute.post(/^\/signup$/, signUp);
authRoute.post(/^\/login$/, login);
authRoute.post(/^\/logout$/,authHandler, logout);
authRoute.use(/^\/verify$/,authHandler, verify);