import jwt from "jsonwebtoken";

const isAuthenticated=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"User Not Authenticated",
                succes:false
            })
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                succes:false
            })
        }
        req.id=decode.userId;
        next();
    }
    catch{

    }
}
export default isAuthenticated;