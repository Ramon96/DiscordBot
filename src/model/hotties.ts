import mongoose from "mongoose";

const hottieSchema = new mongoose.Schema({
  id: String,
  count: Number,
  color: String,
});

export default mongoose.models.Hottie || mongoose.model("Hottie", hottieSchema);
