import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (channelId.toString() === req.user.id.toString()) {
    throw new ApiError(400, "Cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user.id, // correct spelling
  });

  if (existingSubscription) {
    const subscription = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Unsubscribed"));
  } else {
    const subscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Subscribed"));
  }
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({
    channel: channelId,
  });

  const subscriberCount = subscribers.length;

  return re.status(200).json(
    new ApiResponse(
      200,
      {
        subcribers,
        Count: subscriberCount,
      },
      "Subscriber info fetched successfully"
    )
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const channels = await Subscription.find({
    subscriber: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Subscribed Channels Fetched Successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
