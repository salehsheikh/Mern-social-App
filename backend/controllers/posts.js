import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate({path:"comments", populate: {path:"userId", select: "-password"}})
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* COMMENT */
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params; // ID of the post to comment on
    const { userId, comment } = req.body; // User ID and the comment text

    // Find the post
    const post = await Post.findById(id); //set krna hai id not match return error handler

    // Add the comment to the post's comments array
    // post.comments.push({ userId, comment });
    const createComment = await Comment.create({ userId, comment });
    await Post.findByIdAndUpdate(id, {
      $push: { comments: createComment._id },
    });

    // Save the updated post
    // await post.save();

    // Send the updated post as response
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE COMMENT */
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params; // ID of the post and comment to update
    const { comment, postId , userId} = req.body; // Updated comment text

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const exComment = await Comment.findByIdAndUpdate(
      commentId,
      userId,
      { $set: { comment: comment } },
      { new: true }
    );

    if (!exComment) {
      res.status(404).json({ message: "Comment not found or you don't have access to edit the comment" });
    }

    // Find the index of the comment in the comments array
    // const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    // if (commentIndex !== -1) {
    // Update the comment text
    // post.comments[commentIndex].comment = comment;

    // Save the updated post
    // await post.save();

    // Send success response
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const {  commentId } = req.params; // ID of the post and comment ID to delete
    const {postId,userId} = req.body

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the index of the comment in the comments array
    // const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    // if (commentIndex !== -1) {
    //   // Remove the comment from the comments array
    //   post.comments.splice(commentIndex, 1);
 const comment =    await Comment.findOneAndDelete({ _id: commentId , userId});
 if (!comment) {
  return res.status(404).json({ message: "comment not found or you don't have access to delete the comment" });
  
 }
    await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } }, {new: true});
    //   // Save the updated post
    //   await post.save();

    // Send success response
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
