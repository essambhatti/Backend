import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const getChannelStats = asyncHandler(async (req, res) => {

  const channel = await User.findById(req.user.id);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }


  const videos = await Video.find({ owner: channel._id });
  const tweets = await Tweet.find({ owner: channel._id });
  const comments = await Comment.find({ owner: channel._id });


  const totalVideos = videos.length;
  const totalTweets = tweets.length;
  const totalComments = comments.length;

  const subscribers = await Subscription.find({ channel: channel._id });
  const totalSubscribers = subscribers.length;

  const videoIds = videos.map((v) => v._id);
  const tweetIds = tweets.map((t) => t._id);
  const commentIds = comments.map((c) => c._id);


  const totalLikes = await Like.countDocuments({
    $or: [
      { video: { $in: videoIds } },
      { tweet: { $in: tweetIds } },
      { comment: { $in: commentIds } },
    ],
  });

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalTweets,
      totalComments,
      totalSubscribers,
      totalLikes,
    }, "Channel Stats Fetched Successfully")
  );
});


const getChannelVideos = asyncHandler(async (req, res) => {
  const channel = await User.findById(req.user.id);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const videos = await Video.find({ owner: channel._id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videos,
        videos.length > 0
          ? "All videos fetched successfully"
          : "No videos found for this channel"
      )
    );
});

export { getChannelStats, getChannelVideos };
