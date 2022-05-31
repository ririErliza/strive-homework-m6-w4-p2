import GoogleStrategy from "passport-google-oauth20"
import passport from "passport"
import authorsModel from "../../services/authors/model.js"; 
import { generateJWTToken } from "./tools.js"

//1.Check if the user is already in our DB
//2.If user is there --> generate an accessToken for him/her, then next (to the route handler --> /users/googleRedirect)
//3.If user is NOT there --> add user to DB, then create accessToken, then next (to the route handler --> /users/googleRedirect)

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      console.log("GOOGLE PROFILE: ", profile)
    //1
    const author = await authorsModel.findOne({ email: profile.emails[0].value })

    if (author) { 
      //2
      const accessToken = await generateJWTToken({ _id: author._id, role: author.role })

      passportNext(null, { token: accessToken })

      console.log("Author id is", author._id)
      console.log("Author role is:", author.role)

    } else {
      //3
      const newAuthor = new authorsModel({
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        googleId: profile.id,
      })
      const savedAuthor = await newAuthor.save()

      const accessToken = await generateJWTToken({ _id: savedAuthor._id, role: savedAuthor.role })

      console.log("ACCESS TOKEN: ", accessToken)

      passportNext(null, { token: accessToken })
    }
      
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
    
  }

)

passport.serializeUser((data, passportNext) => {
  passportNext(null, data)
})
export default googleStrategy
