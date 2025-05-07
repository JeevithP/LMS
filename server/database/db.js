import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");
    }catch{
        console.log("Error Connecting");
    }
}
export default connectDb