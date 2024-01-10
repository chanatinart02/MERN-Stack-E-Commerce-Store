import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @POST /api/category
// Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    // Check Category
    const existingCat = await Category.findOne({ name });
    if (existingCat) {
      return res.json({ error: "Already have this Category name" });
    }
    // Create and Save
    const category = await new Category({ name }).save();

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @PUT /api/category/:id
// Admin
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const updatedCat = await Category.findOneAndUpdate(
      { _id: categoryId },
      { name },
      { new: true }
    );

    if (!updatedCat) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      return res.status(200).json(updatedCat);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @PUT /api/category/:id
// Admin
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const removeCat = await Category.findByIdAndDelete({ _id: categoryId });

    if (!removeCat) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @GET /api/category/categories
const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @GET /api/category/categories
const readCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById({ _id: id });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  getCategory,
  readCategory,
};
