import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountInfo, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);


router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-user-info").post(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/update-account-info").post(verifyJWT,updateAccountInfo);
router.route("/change-avatar").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  }
]),updateUserAvatar);

export default router;
