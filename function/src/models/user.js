import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName:{type: String, required:[true, "First Name is mandatory field"]}, 
        //In above required validator we aslo throw custome error message
        lastName:{type: String},
        streetName:{type:String},
        email:{type: String, required:true, trim:true, unique:[true, "account with this email already exist"]},
        gender:{type: String, required:true},
        age:{type: Number, required:true},
        phone:{type: Number, required:[true, "phone number is mandatory field"], validate(value){if(value !== 10){throw new Error("phone number should be 10 digits")}}},
        photoURL:{type: String, default:"https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"},
        skills:{
            type:[String], 
            minlength:1, 
            set:(incomingArray) => {return [...new Set(incomingArray)]} //remove duplicate
        } 
    },
    {timestamps:true}
)

const User = mongoose.model("User", userSchema);

export { User };