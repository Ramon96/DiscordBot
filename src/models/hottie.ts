import mongoose from "mongoose";

const hottieSchema = new mongoose.Schema({
  id: { type: String, required: true },
  count: { type: Number, required: true },
  color: { type: String, required: false },
});

export const HottieSchema = mongoose.model("Hottie", hottieSchema);
