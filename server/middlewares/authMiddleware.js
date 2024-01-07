import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// Middleware for authenticating users using JWT
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie sent with the request (presumably set during login)
  token = req.cookies.jwt;
  if (token) {
    try {
      // Verify the JWT using the secret stored in the .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user details (excluding password) based on the decoded userId
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Call the next middleware in the stack
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // If no JWT is provided
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware for authorizing users as admins
const authorizeAdmin = async (req, res, next) => {
  // Check if the authenticated user is an admin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizeAdmin };
