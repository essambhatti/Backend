import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content Field is required");
  }

  const user = await User.findById(req.user);

  const tweet = await Tweet.create({
    content,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Create Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const user = await User.findById(req.user);

  const allTweets = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "owner",
        as: "tweets",
      },
    },
    {
      $project: {
        tweets: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allTweets,
        "All tweets of current user fetched successfully"
      )
    );

  // const tweets = await Tweet.find({ owner: req.user._id });
  // return res
  //   .status(200)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       tweets,
  //       "All tweets of current user fetched successfully"
  //     )
  //   );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content field is required ");
  }

  const tweet = await Tweet.findById(req.params.tweetId);
  if (!tweet) {
    throw new ApiError(400, "No tweet Found");
  }
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const tweet = await Tweet.findById(req.params.tweetId);
  if (!tweet) {
    throw new ApiError(400, "No tweet Found");
  }
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
