import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    brand: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);