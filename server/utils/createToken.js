import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Generate a new JWT
  // The token payload contains the userId, and it is signed using a secret (process.env.JWT_SECRET).
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // หมดอายุ
  });

  // Set the JWT as an HTTP-only cookie in the response object.
  res.cookie("jwt", token, {
    httpOnly: true, // cookie is only accessible via HTTP(S)
    secure: process.env.NODE_ENV !== "development", // Set to true in production to only send cookies over HTTPS.
    sameSite: "strict", // Helps prevent CSRF attacks  the cookie is sent only to the same site as the request
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // Return the generated token.
};

export default generateToken;
