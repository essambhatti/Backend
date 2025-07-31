import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLikeStatus = await Like.findOne({
    video: videoId,
    likedBy: req.user.id,
  });

  if (existingLikeStatus) {
    const like = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user.id,
    });
    return res.status(200).json(new ApiResponse(200, like, "Unliked"));
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
    const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLikeStatus = await Like.findOne({
    comment : commentId,
    likedBy: req.user.id,
  });

  if (existingLikeStatus) {
    const like = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user.id,
    });
    return res.status(200).json(new ApiResponse(200, like, "Unliked"));
  } else {
    const like = await Like.create({
      comment: commentId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLikeStatus = await Like.findOne({
    tweet : tweetId,
    likedBy: req.user.id,
  });

  if (existingLikeStatus) {
    const like = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user.id,
    });
    return res.status(200).json(new ApiResponse(200, like, "Unliked"));
  } else {
    const like = await Like.create({
      tweet: tweetId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const videos =  await Like.find({
    likedBy : req.user.id,
    video: { $exists: true, $ne: null }
}).populate('video')

    return res.status(200)
    .json(new ApiResponse(200, videos, "All liked Videos Fetched Successfully"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
