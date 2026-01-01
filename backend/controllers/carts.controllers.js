import Cart from "../models/cart.js"
import {ApiError} from "../utils/api_error.js";
import Book from "../models/book.js"

export const getcartitem=async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user_id }).populate("items.book"); // Optional: populate book details
    
  if (!cart || cart.items.length === 0) {
    
    return res.json({items:[]});
  }

  res.status(200).json({items:cart.items});
};

export const createcartitem=async (req, res) => {
    const { id } = req.params;
    const user_id = req.user_id;
    
    // Check if book exists
    const bookData = await Book.findById(id);
    
    if (!bookData) {
         throw new ApiError(404,"Book not found");
    }
    
    // Check if cart exists for the user
    let userCart = await Cart.findOne({ userId: user_id });
    
    if (!userCart) {
        // If cart doesn't exist, create a new one
        
        const newCart = new Cart({
            userId: user_id,
            items: [{ book: id, count: 1 }]
        });
       const res= await newCart.save();
       
        return res.status(200).json({message:"Cart created and book added",success:true});
    }
    
    // If cart exists, check if book is already in the cart
    const itemIndex = userCart.items.findIndex(item => item.book.toString() === id);

    if (itemIndex > -1) {
        // Book exists in cart, increment count
        userCart.items[itemIndex].count += 1;
    } else {
        // Book not in cart, add it
        userCart.items.push({ book: id, count: 1 });
    }

    await userCart.save();
    
    res.status(200).json({message:"Book added updated in cart successfully",success:true});
};

export const modifycartitem=async (req, res) => {
    const { bookId } = req.params;
    const { action } = req.body;
    const userId = req.user_id;

    const incValue = action === "increment" ? 1 : action === "decrement" ? -1 : null;
    if (incValue === null)
        throw new ApiError(400,"Invalid action");

    const result = await Cart.updateOne(
        { userId, "items.book": bookId },
        { $inc: { "items.$.count": incValue } }
    );

    if (result.modifiedCount === 0) {
        throw new ApiError(404,"Book not found in cart");
    }

    res.status(200).json({message:`Book count ${action}ed successfully`,success:true});
};

export const deletecartitem=async (req, res) => {
    const { id } = req.params;
    const userId = req.user_id;

    const result = await Cart.updateOne(
        { userId },
        { $pull: { items: { book:id } } }
    );

    if (result.modifiedCount === 0) {
        throw new ApiError(400,"Book not found in cart");
    }

    res.status(200).json({message:"Book removed from cart successfully",success:true});
}
