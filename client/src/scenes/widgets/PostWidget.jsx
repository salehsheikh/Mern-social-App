import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import { setPost } from "../../state";
import { useDispatch, useSelector } from "react-redux";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments, // Rename 'comments' prop to 'initialComments'
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editedComment, setEditedComment] = useState(""); // State for edited comment text
  const [editedCommentId, setEditedCommentId] = useState(""); // State for edited comment ID
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, comment: commentText }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setCommentText("");
      setIsComments(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentEdit = async (commentId) => {
    try {
      // Check if commentId is valid
      if (!commentId) {
        console.error("Comment ID is missing for edit");
        return;
      }
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment/${commentId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: editedComment }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditedComment("");
      setEditedCommentId("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  
  const handleCommentDelete = async (commentId) => {
    if (!commentId) {
      console.error("Comment ID is missing for deletion");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  const handleShareToWhatsApp = () => {
    // Replace 'post-url' with the actual URL of the post
    window.open(`https://api.whatsapp.com/send?text=post-url`, "_blank");
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{initialComments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <Box>
          <IconButton onClick={handleShareToWhatsApp}>
            <ShareOutlined />
          </IconButton>
        </Box>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={handleCommentSubmit}>Submit</button>
          {initialComments.map((comment, i) => (
            <Box key={`${postId}-${i}`}>
              <Divider />
              {comment.userId === loggedInUserId ? ( // Check if the comment is by the logged-in user
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem", flex: 1 }}>
                    <strong>{comment.userId}</strong>: {editedCommentId === comment._id ? ( // Check if the comment is being edited
                      <input
                        type="text"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      />
                    ) : (
                      comment.comment
                    )}
                  </Typography>
                  {editedCommentId === comment._id ? (
                    <IconButton onClick={() => handleCommentEdit(comment._id)}>
                      Save
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => {
                      setEditedComment(comment.comment);
                      setEditedCommentId(comment._id);
                    }}>
                      Edit
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleCommentDelete(comment._id)}>
                    Delete
                  </IconButton>
                </Box>
              ) : (
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  <strong>{comment.userId}</strong>: {comment}
                </Typography>
              )}
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;