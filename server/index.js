import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static assets (such as uploaded images) from the "uploads" directory
const __dirname = path.resolve();
// any files in the "uploads" directory will be accessible to clients via the specified URL path
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
