import express from "express";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  removeCategory,
  getCategory,
  readCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/categories").get(getCategory); // Get all
router.route("/:id").get(readCategory); // Get Cat by Id

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

export default router;
