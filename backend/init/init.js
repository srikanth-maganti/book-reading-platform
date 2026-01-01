import mongoose  from "mongoose";
import  initdata from "./data.js";
import  books from "../models/book.js";


async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/buyabook');
}

main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})

async function insertdb()
{
    await books.deleteMany({});
    await books.insertMany(initdata);

}

insertdb().then(()=>{
    console.log("inserted all data");
})
.catch((Err)=>{
    console.log(Err);
})