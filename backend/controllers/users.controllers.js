import crypto from "crypto"
import dotenv from "dotenv"
import User from "../models/user.js"
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js"
import { sendmail,forgotmailcontentgenerator } from "../utils/mail.js"
dotenv.config();



export const loginuser=async(req,res)=>{
    let {email,password}=req.body;
    
    let user=await User.findOne({email});
    if(!user)
    {
        throw new ApiError(400,"User not found with this email");
    }
    
    if(!user.verifyPassword(password))
    {
       throw new ApiError(400,"Invalid Password");
    }
    
    const token=await user.generateAccessToken();
    res.status(200).json(new ApiResponse(200,"User Login successful",{userId:user._id,name:user.name,email:user.email,token}));
};

export const signupuser=async (req, res) => {
  
  let { name, email, password } = req.body;
  
  let existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(400,"User already exists with this email");
  }

  let newUser = new User({
    name,
    email,
    password,
  });
  
  const token=await newUser.generateAccessToken();
  await newUser.save();
  res.status(200).json(new ApiResponse(200,"User Signup successful",{userId:newUser._id,name:newUser.name,email:newUser.email,token:token}));
};



export const getme=async(req,res)=>{
  const {userId}=req.user;
  if(!userId)
  {
    throw new ApiError(400,"User not Found");
  }

  const user=await User.findById(userId).select("-password");
  if(!user)
  {
    throw new ApiError(400,"User not Found");
  }

 return res.status(200).json(new ApiResponse(200,"User Details fetched Successfully",data=user));
}



export const forgotpassword=async (req,res)=>{
  //verify email
  const {email}=req.body;
  if(!email)
  {
    throw new ApiError(400,"Invalid Data");
  }

  //verify user exist or not
  const user=await User.findOne({email});
  if(!user)
  {
    throw new ApiError(400,"User doesnt exists");

  }
  //genearate a token
  const token=crypto.randomBytes(32).toString('hex');
  if(!token)
  {
    throw new ApiError(400,"unable to reset password");
  }
  user.passwordresettoken=token;
  user.passwordresetexpiry=Date.now()+10*1000*60*60;

  await user.save();


  //send email
  const url=`http://localhost:5173/resetpassword/${token}`;
  const content=forgotmailcontentgenerator(user.name,url);
  const subject="Verification email for reseting password";
  await sendmail(subject,content)
 
  return res.status(200).json(new ApiResponse(200,"Verification code sent to your registered email"));

}


export const resetpassword=async(req,res)=>{
  const {password,token}=req.body;
  if(!token)
  {
    throw new ApiError(400,"Verification Failed");
  }

  const user=await User.findOne({passwordresettoken:token,passwordresetexpiry:{$gt:Date.now()}});
  if(!user)
  {
    throw new ApiError(400,"Verification Failed");
  }
  user.password=password;
  user.passwordresetexpiry = undefined;
  user.passwordresettoken = undefined;
  await user.save();
  res.status(200).json(new ApiResponse(200,"Password reset successful"));
}