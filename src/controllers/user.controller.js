import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get data from frontend
  const { fullname, email, username, password } = req.body;
  console.log("Email: ", email);

  //check if user already exists
  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  const existedemail = await User.findOne({ email });

  if (existedemail) {
    throw new ApiError(409, "User with this email already exists");
  }
  const existedusername = await User.findOne({ username });

  if (existedusername) {
    throw new ApiError(409, "User with this username already exists");
  }

  //handling files
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar field is required");
  }

  // uploading on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar field is required");
  }

  // enter data in database
  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    password,
    coverImage: coverImage?.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
});

export { registerUser };
