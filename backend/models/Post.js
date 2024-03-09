import mongoose
 from "mongoose";
 const postSchema=mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        locaton:String,
        description:String,
        picturePath:String,
        userPicturePath:String,
        likes:{
            type:Map,
            of:Boolean,
        },
        comments:{
            type:Array,
            default:[],
        }
    },
    {timestamps:true}
 );

 const Post=mongoose.model("Post",postSchema)
 export default Post;