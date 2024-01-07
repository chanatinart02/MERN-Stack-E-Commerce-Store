import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for creating a new user or getting all users (requires authentication and admin authorization)
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutUser);

export default router;
