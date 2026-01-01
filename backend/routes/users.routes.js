import express from "express"
import {asyncHandler} from "../utils/async_handler.js";
import { forgotpassword, loginuser,resetpassword,signupuser } from "../controllers/users.controllers.js";
const userrouter=express.Router();

userrouter.post("/login",asyncHandler(loginuser));
userrouter.post("/signup",asyncHandler(signupuser));
userrouter.post("/forgotpassword",asyncHandler(forgotpassword));
userrouter.post("/resetpassword",asyncHandler(resetpassword));

export default userrouter;