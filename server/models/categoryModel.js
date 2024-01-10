import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // remove whitespaces before / after string before stored
    required: true,
    maxLength: 32,
    unique: true,
  },
});

export default mongoose.model("Category", categorySchema);
