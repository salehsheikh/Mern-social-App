import mongoose from "mongoose";
const commentSchema=mongoose.Schema(
    {
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
          },
          comment:{
            type:String,
            trim:true
          }
          
    },
    { timestamps: true }
)
const Comment= mongoose.model("Comment",commentSchema);

export default Comment;