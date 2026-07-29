import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email:{
        type: String
    },
    gender:{
        type: String
    },
    age:{
        type: Number
    }}
)

const User = mongoose.model("User", userSchema);

export { User };
