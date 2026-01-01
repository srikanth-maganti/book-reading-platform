
import mongoose from "mongoose";


const sellerSchema=new mongoose.Schema({
    businessName:{
        type:String,
        required:true
    },
    gstNumber:{
        type:String,
        required:true
    },
    panNumber:{
        type:String,
        required:true
    }
    ,
    contactName:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    bankName:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true
    },
    ifscCode:{
        type:String,
        required:true
    }



})

const Seller=mongoose.model("sellers",sellerSchema);
export default Seller;