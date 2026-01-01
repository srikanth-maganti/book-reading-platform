import Book from "../models/book.js"
import {ApiError} from "../utils/api_error.js";

export const allbooks=async (req, res) => {
    const { category, search } = req.query;
    let data=null;
    if (search) {
        data = await Book.find({
            $or: [
                { Title: { $regex: search, $options: "i" } },
                { Author: { $regex: search, $options: "i" } },
                { Category: { $regex: search, $options: "i" } }
            ]
        });
    } else if (category && category !== "All") {
        data = await Book.find({ Category: category });
    } else {
        data = await Book.find({});
    }

    if (!data || data.length === 0) {
        throw new ApiError(404,"No Books Found");
    }
    

    res.status(200).json(data);
}

export const showbook=async(req,res)=>{
    let {id}=req.params;
    let [data]=await Book.find({_id:id});
    
    if(!data)
    {
        throw new ApiError(400,"Book Not Found");
    }
    
    res.status(200).json(data);
}

export const trendingbooks=async(req,res)=>{
    res.status(200).json([]);
}

export const addbook=async(req,res)=>{
    let newbook=new Book(req.body.book);
    await newbook.save();
    res.status(200).json({message:"book added successfully",success:true})
}