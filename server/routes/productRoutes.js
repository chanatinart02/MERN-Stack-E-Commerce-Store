import express from "express";
import formidable from "express-formidable"; //  middleware for handling of forms and file uploads

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  getProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(fetchProducts) // can get product with keyword
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.get("/allproducts", fetchAllProducts); // get latest 12 products
router.get("/top", fetchTopProducts); // get top 4 rating products
router.get("/new", fetchNewProducts); // get recently added products

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct);

export default router;
