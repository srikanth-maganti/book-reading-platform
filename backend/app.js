import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import jwt from "jsonwebtoken"
import methodoverride from "method-override";
import {db_connection} from "./db/db.js"
import bookrouter from   "./routes/books.routes.js"
import cartrouter from "./routes/carts.routes.js"
import userrouter from "./routes/users.routes.js"




import {ApiError} from "./utils/api_error.js";
import { OAuth2Client }  from "google-auth-library";
import  User from "./models/user.js";
dotenv.config();


const app=express();
db_connection()
.then(()=>{
        console.log("connected to database");
        //server running
        app.listen(process.env.PORT,()=>{
                console.log("server started listening on port:",process.env.PORT);
        })  
    })
    .catch((err)=>{
        console.log(err);
        process.exit(1);
    })

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.use(
  cors({
    origin: process.env.BASE_URL, // Allow only your frontend
    methods: "GET, POST, PUT,PATCH, DELETE",
    allowedHeaders: ["Content-Type","Authorization"],
  })
);

app.use("/books",bookrouter);

app.use("/cart",cartrouter);

app.use("/users",userrouter);



//authentication

const client = new OAuth2Client(process.env.CLIENT_ID);
app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name:name,email:email });
    }

    // Create JWT token for session
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("success",appToken);
    res.json({ token: appToken });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});








//Error handling
app.all("*",(req,res,next)=>{
    next( new ApiError(400,"Page not found")) ;
})
app.use((err,req,res,next)=>{
    let{status=500,message="UnKnown Error"}=err;
    res.status(status).json({message,success:false});
})



