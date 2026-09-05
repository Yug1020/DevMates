import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const userSchema = new mongoose.Schema(
    {
        firstName:{type: String, required:[true, "First Name is mandatory field"], min:2, max:15},

        //In above required validator we also throw custome error message

        lastName:{type: String, min:2, max:15},
        streetName:{type:String, min:2, max:15},
        email:{type: String, required:true, trim:true, unique:[true, "account with this email already exist"], max: 45},
        password:{type: String, required:true, trim:true},
        gender:{type: String, required:true},
        age:{type: Number, required:true, maxlength:3},
        phone:{type: Number, required:[true, "phone number is mandatory field"], validate(value){if(value.toString().length !== 10){throw new Error("phone number should be 10 digits")}}},
        photoURL:{type: String, default:"https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"},
        bio:{type:String, max:150},
        profession:{type:String, max:20, default:"Engineer"},
        goal:{type:String, max:20},
        goalDeadline:{type: Date},
        skills:{
            type:[String], 
            minlength:1, 
            set:(incomingArray) => {return [...new Set(incomingArray)]} //remove duplicate
        },
        createdAt: { type: Date, default: () => 
          {
            const now = new Date();
            // Add 5.5 hours in milliseconds (5.5 * 60 * 60 * 1000)
            const istOffset = 5.5 * 60 * 60 * 1000; 
            return new Date(now.getTime() + istOffset);
          }
        },
        updatedAt: { type: Date, default: () => 
          {
            const now = new Date();
            // Add 5.5 hours in milliseconds (5.5 * 60 * 60 * 1000)
            const istOffset = 5.5 * 60 * 60 * 1000; 
            return new Date(now.getTime() + istOffset);
          }
        }              
    }
)


userSchema.methods.generateAuthtoken = function() {
    const payload = {user_id : this._id}
    const token = jwt.sign(payload , process.env.secretKey, {expiresIn: "168h"})
    return token;
}

userSchema.methods.verifyPassword = async function(passwordInputByUser){
    const match = await bcrypt.compare(passwordInputByUser, this.password)

    return match
}

const User = mongoose.model("User", userSchema);

export { User };