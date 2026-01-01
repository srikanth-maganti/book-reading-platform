import express from "express"
import {asyncHandler} from "../utils/async_handler.js";
import { validatebook } from "../middleware/validate_book.js";
import { allbooks,showbook,trendingbooks,addbook } from "../controllers/books.controllers.js";
const bookrouter=express.Router();

bookrouter.get("/",asyncHandler(allbooks));
bookrouter.get("/show/:id",asyncHandler(showbook));
bookrouter.get("/trending",asyncHandler(trendingbooks));
bookrouter.post("/",validatebook,asyncHandler(addbook));

export default bookrouter;