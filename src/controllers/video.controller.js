import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  const pipeline = [];

  // 1. Optional search filter
  if (query) {
    pipeline.push({
      $match: {
        title: { $regex: query, $options: "i" }, // Case-insensitive search
      },
    });
  }

  // 2. Optional filter by user
  if (userId) {
    pipeline.push({
      $match: { user: userId },
    });
  }

  // 3. Sorting
  const sortField = sortBy || "createdAt";
  const sortOrder = sortType === "asc" ? 1 : -1;

  pipeline.push({
    $sort: { [sortField]: sortOrder },
  });

  // 4. Pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageSize });

  // 5. Run the aggregation
  const videos = await Video.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All Videos Fetched Successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const user = await User.findById(req.user.id);
  console.log("User Found");

  if (!title || !description) {
    throw new ApiError(400, "All field are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  console.log("Files tracked");

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("Uploading on Cloudinary");
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log("Uploaded on Cloudinary");

  //   if (!videoFile || !thumbnail) {
  //     throw new ApiError(400, "All fields are required");
  //   }
  console.log("Video Creating");
  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    views: 0,
    isPublished: true,
    owner: user._id,
    duration: videoFile.duration,
  });
  console.log("Video Created");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  const video = await Video.findById(videoId).populate(
    "owner",
    "username avatar"
  );

  if (!video) {
    throw new ApiError("No Video Found");
  }
  if (req.user.id !== video.owner._id.toString()) {
    video.views += 1;
    await video.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const video = await Video.findById(req.params.videoId);
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized request");
  }
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }
  const thumbnailLocalPath = req.file?.path;
  console.log("Files received:", req.files);

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail field is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  video.thumbnail = thumbnail.url;
  video.title = title;
  video.description = description;
  await video.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    throw new ApiError(404, "Video Not Found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized request");
  }

  await video.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = await User.findById(req.user);
  const video = await Video.findById(req.params.videoId);

  if (user.id !== video._id) {
    throw new ApiError(
      400,
      "You are not authorize to change its publish status"
    );
  }
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(200, video, "Published status Changed Successfully");
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
