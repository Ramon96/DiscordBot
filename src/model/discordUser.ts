import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  id: String,
  birthday: String,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
