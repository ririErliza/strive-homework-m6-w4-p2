import createError from "http-errors";
import { verifyJWTToken } from "./tools.js";


//here we begin the process to verifies JWT Signature and Validity

//1. check if request contains Authorization header, if not send 401 error
//2. extract the token from Authorization header (without the Bearer part, just the token)
          // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjhiNTFmZmRkNzJmY2YyNmFiMzI3M2MiLCJpYXQiOjE2NTMyOTc3MjUsImV4cCI6MTY1MzkwMjUyNX0.TdcTxYBt9prQrOqIUG55iFNIEuoq0Y5Ipg1jw0wvP_A
//3. Verify token validity and integrity, in case of serror send 401 error
//4. If everything is alright --> next(), then  attaching to the request some informations about the current Logged in user/author

export const JWTAuthMiddleware = async (req,res,next) =>{
//1
if(!req.headers.authorization){
    next(createError(401, "Please provide the bearer token in the Authorization header"))
}else{
    try {
        //2
        const token = req.headers.authorization.replace("Bearer ", "")
        console.log("token is:", token)

        //3
        const payload = await verifyJWTToken(token)
        console.log(payload)

        //4
       req.author={
           _id:payload._id,
           role: payload.role,

       }

        next()
    } catch (error) {
        console.log(error)
        next(createError(401, "Token is not valid"))
    }
}

}