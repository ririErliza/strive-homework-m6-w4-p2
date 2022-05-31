// In this file we define two Mongoose Objects: Schema, Model

// Schema = shape of the data we gonna have in a certain collection
// Model = functionalities, interactions with a specific collection (find, save, update, delete)

import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: String, required: false },
    avatar: {type: String, required: false},
    password: { type: String, required: false},
    role: {type: String, required: true, default:"User", enum:["User", "Admin"]},
    googleId: { type: String, required: false },
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  }
)

//*******************************      HASHING     *****************************//


// here, we want to hash the password (entered by user/author during registration) before we save it (save where? in DB)
authorsSchema.pre("save", async function(next){
  const newAuthor = this

  const plainPass = newAuthor.password
  
if(newAuthor.isModified("password")){
  const hash = await bcrypt.hash(plainPass, 9)

  newAuthor.password = hash
}
  

  next()
})

//here, we dont want the password to show up at response result (but it still there in DB)
authorsSchema.methods.toJSON = function () {

  const authorDocument = this
  const authorObject = authorDocument.toObject()

  delete authorObject.password

  //we can add other that we dont want to show at the result
  delete authorObject.__v

  return authorObject
}



//*******************************     COMPARING      *****************************//

authorsSchema.statics.checkCredentials = async function (email, plainPass) {
  const author = await this.findOne({email})

  if (author) {
    const isMatch = await bcrypt.compare(plainPass, author.password)

    if (isMatch) {
      return author
    } else {
      return null //password INCORRECT
    }
  } else {
    return null //email INCORRECT
  }

}



// usage = await authorsModel.checkCredentials("john@doe.com", "1234password")
// authorsModel.findOne()  is the same as  this.findOne() --> in the "statics", "this" keyword represents the authorsModel itself


export default model("Author", authorsSchema) // this is going to be connected to the users collection


