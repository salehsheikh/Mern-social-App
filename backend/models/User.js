import mongoose from "mongoose";
const UserScema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            min:2,
            max:50,
        },
       lastName:{
            type:String,
            required:true,
            min:2,
            max:50,
        },
        email:{
            type:String,
            required:true,
            min:2,
           unique:true
        },
        password:{
            type:String,
            required:true,
            min:5,
        },
       picturePath:{
            type:String,
            default:"",
        },
friends:{
            type:Array,
            default:[],
        },
        location:String,
        occupation:String,
        viewedProfile:Number,
        impression:Number,
    },{timestamps:true}
);
const User=mongoose.model("User",UserScema);
export default User;