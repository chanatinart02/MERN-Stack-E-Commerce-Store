import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    //  express-formidable parsing form data, including fields and files in req.fields
    //   req.body is typically used for parsing JSON or URL-encoded data, not form data.
    const { name, brand, quantity, categoryId, description, price } =
      req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
      case !categoryId:
        return res.json({ error: "Category is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, quantity, categoryId, description, price } =
      req.fields;

    const updateProduct = await Product.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.fields,
      },
      { new: true }
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete({ _id: id });

    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Delete product successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// GET product with keyword
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    // Set the number of products to show per page
    const pageSize = 6;
    let keyword = req.query.keyword;

    // Check if the 'keyword' query parameter exists in the request
    if (keyword) {
      // If it exists, construct a MongoDB query object to match the 'name' field
      // with a case-insensitive regular expression of the keyword
      keyword = { name: { $regex: req.query.keyword, $options: "i" } };
    } else {
      keyword = {};
    }

    // Count the number of documents in the 'Product' collection that match the keyword
    const count = await Product.countDocuments({ ...keyword });

    // Retrieve a list of products that match the keyword
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.status(200).json({
      products,
      page: 1, // the current page number (1),
      pages: Math.ceil(count / pageSize), // total number of pages
      hasMore: false, // flag indicating that there are no more products to load
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// @GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});
// GET /api/products/allproducts
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // Retrieve the latest 12 products from the database.
    // `.find({})` is used to get all products without any filter.
    // `.populate("categoryId")` populates the category details of each product
    const products = await Product.find({})
      .populate("categoryId")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// POST /api/products/:id/reviews
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params; // product ID
    // the authenticated user making the review
    const userId = req.user._id;

    // Find the product by ID to ensure it exists before adding a review
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Check if the user has already reviewed the product by searching the reviews array
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    // If the user has already reviewed, send a 400 response
    if (alreadyReviewed) {
      res.status(400).json({ message: "Product already reviewed" });
      return;
    }

    // Create a new review object with the user's name, the rating as a number, and the comment
    const newReview = {
      userId: userId,
      name: req.user.username,
      rating: Number(rating),
      comment,
    };

    // Add the new review to the product's reviews array
    product.reviews.push(newReview);

    // Update the number of reviews for the product
    product.numReviews = product.reviews.length;

    // Calculate the average rating based on all reviews
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.numReviews;

    // Save the updated product with the new review
    await product.save();

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// GET /api/products/top
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    // Get top 4 products with the highest rating
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// GET /api/products/new
const fetchNewProducts = asyncHandler(async (_req, res) => {
  try {
    // Fetch the 5 most recently added products by sorting them in descending order by their ID
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// POST /api/products/filtered-products
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    // Initialize an object to hold query arguments
    let args = {};

    // If `checked` array has elements, add `categoryId` to the query arguments
    // `checked` should contain the IDs of categories to filter by
    if (checked.length > 0) args.categoryId = checked;

    // If `radio` array has elements, construct a range query for price
    // `radio` is expected to have two elements: [minPrice, maxPrice]
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  getProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
