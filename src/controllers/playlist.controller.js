import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (!name || !description) {
    throw new ApiError(403, "Name and Description fields are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user.id,
    videos: [],
  });
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  const playlists = await Playlist.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlists,
        playlists.length > 0
          ? "All user playlists fetched successfully"
          : "No playlists found for this user"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized Request");
  }
  if (playlist.videos.some((v) => v.toString() === videoId)) {
    throw new ApiError(400, "Video is already in playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video Added Successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not found");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized Request");
  }
  if (!playlist.videos.some((v) => v.toString() === videoId)) {
    throw new ApiError(400, "Video is already not in playlist");
  }
  playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId);

  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video Deleted Successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not Found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized Request");
  }
  await playlist.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not Found");
  }
  if (!name || !description) {
    throw new ApiError(400, "Name and Description are required");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Unauthorized Request");
  }
  playlist.name = name;
  playlist.description = description;
  await playlist.save({validateBeforeSave : false})
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Updated Successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
