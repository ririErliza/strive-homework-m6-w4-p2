import jwt from "jsonwebtoken";

//here, we want to generate a token and verify it
// jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:"1 week"}, (err, token) =>{})

// jwt.verify(token, process.env.JWT_SECRET, (err, payload) =>{})

//------------------------------------------------------------------------------------



//generate token
//Input: payload, output: promise that resolve into a token

export const generateJWTToken = payload =>
new Promise ((resolve, reject)=>
jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:"1 week"}, (err, token) =>{
    if(err) reject(err)
    else resolve(token)
    
})
)


//verify token
//Input: token, output: payload
export const verifyJWTToken = token =>
new Promise ((resolve, reject)=>
jwt.verify(token, process.env.JWT_SECRET, (err, payload) =>{
    if(err) reject(err)
    else resolve(payload)
    
})
)
