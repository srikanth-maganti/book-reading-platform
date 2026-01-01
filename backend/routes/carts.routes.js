import express from "express";
import {asyncHandler} from "../utils/async_handler.js";
import { authenticate_user } from "../middleware/authenticate_user.js";
import { getcartitem,createcartitem,modifycartitem,deletecartitem } from "../controllers/carts.controllers.js";

const cartrouter=express.Router();

cartrouter.get("/",authenticate_user,asyncHandler(getcartitem));
cartrouter.post("/:id",authenticate_user , asyncHandler(createcartitem) );
cartrouter.patch("/:bookId",authenticate_user,asyncHandler(modifycartitem));
cartrouter.delete("/:id",authenticate_user,asyncHandler(deletecartitem));

export default cartrouter;
