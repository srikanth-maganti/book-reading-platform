import mongoose from "mongoose";

const bookschema=new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Author:{
        type:String,
        required:true
    },

    Image:{
        type:String,
        default:"https://images.unsplash.com/photo-1646065539148-6fafbf306c0e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    },
    
    Price:
    {
        type:Number,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    // Seller:{type:String,
    //     required:true
    // },
    ISBN:{
        type:String,
        required:true
    },
    Language:{type:String,
        required:true
    },
    Category:String,
    Condition:String,
    Pages:Number,
    Publisher:String,
    PublishedYear:String,
    Description:String,


});

const Book=mongoose.model("Book",bookschema);

export default Book;
