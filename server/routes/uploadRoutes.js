import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  // Set destination to 'uploads/' folder
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  // Set the filename
  filename: (req, file, cb) => {
    // Extract the file extension from the original filename
    const extname = path.extname(file.originalname);
    // Generate a unique filename using the fieldname, current timestamp, and file extension
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

// Define a file filter function to specify the types of files to accept
const fileFilter = (req, file, cb) => {
  // Allowed file extensions and MIME types
  const fileTypes = /jpeg|jpg|png/;
  const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;

  // Extract the file extension and MIME type from the uploaded file
  const extname = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Check if the file extension and MIME type are allowed
  if (fileTypes.test(extname) && mimeTypes.test(mimeType)) {
    cb(null, true); // If matches, allow the upload
  } else {
    // Reject the file if it does not match the allowed types
    cb(new Error("Images only!"), false);
  }
};

// Set up the multer instance with the configured storage and file filter
const upload = multer({ storage, fileFilter });

// Specify that only a single file with the fieldname "image" should be uploaded
const uploadSingleImage = upload.single("image");

// Route: /api/upload to handle single image uploads
router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      // If upload is successful, send a response with the image path
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
