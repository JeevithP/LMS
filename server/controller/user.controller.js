import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields including role must be filled.",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists for the given email-id",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashPassword,
            role, // ✅ Save role
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
        });

    } catch (err) {
        console.log("error in registering", err);
        return res.status(500).json({
            success: false,
            message: "Failed to register",
        });
    }
};


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All Fields need to filled."
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect Email or password"
            })
        }
        const isPassword=await bcrypt.compare(password,user.password);
        if(!isPassword){
            return res.status(400).json({
                success:false,
                message:"Incorrect Email or password"
            })
        }
        generateToken(res,user,`Welcome Back ${user.name}`);


    }catch{
        console.log("error in login")
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}
export const logout=async(_,res)=>{
    
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged Out Successfully.",
            success:true
        })
    }catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        })
    }
}
export const getUserProfile=async(req,res)=>{
    try{
        const userId=req.id;
        console.log("in controller :",userId);
        const user=await User.findById(userId).select("-password").populate("enrolledCourses");
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Profile Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            user:user
        })
    }catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load User"
        })
    }
}
export const updateProfile =async(req,res)=>{
    try{
        const userId=req.id;
        const {name}=req.body;
        const profilePhoto=req.file;

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        // publicId of old image of url if exists
        if(user.photoUrl){
            const publicId=user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId)
        }
        const cloudResponse=await uploadMedia(profilePhoto.path);
        const photoUrl=cloudResponse.secure_url;

        const updatedData={name,photoUrl}
        const updatedUser=await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile Updated Successfully."
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Failed To Update Profile"
        })
    }
}