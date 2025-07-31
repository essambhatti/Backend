import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comments = await Comment.find({ video: video._id })
    .populate("owner", "username avatar") // optional
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalComments = await Comment.countDocuments({ video: video._id });

  const message =
    comments.length === 0
      ? "This video has no comments. Be the first to comment!"
      : "Comments fetched successfully";

  return res.status(200).json(
    new ApiResponse(200, {
      comments,
      pagination: {
        total: totalComments,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalComments / limit),
      },
    }, message)
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content field is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    video: video._id,
    owner: req.user._id,
    content,
  });

  const populatedComment = await comment.populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, populatedComment, "Comment added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content field is required");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  comment.content = content;
  await comment.save({ validateBeforeSave: false });

  await comment.populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment Not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized Request");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
