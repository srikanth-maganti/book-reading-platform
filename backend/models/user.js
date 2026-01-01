import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
       
    },
    passwordresettoken:{
        type:String,
        default:undefined,
    },
    passwordresetexpiry:{
        type:Date,
        default:undefined,
    }
    

},{timestamps:true})

UserSchema.pre("save",async function(next)
{
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})
UserSchema.methods.verifyPassword=async function(password)
{
    const passwordmatch=await bcrypt.compare(password,this.password);
    return passwordmatch;
}

UserSchema.methods.generateAccessToken=async function()
{
    const token = await jwt.sign({ userId: this._id,email:this.email,name:this.name }, process.env.JWT_SECRET, {
        expiresIn: '1h',
        });
    return token;
}



const User=mongoose.model("User",UserSchema);
export default User;