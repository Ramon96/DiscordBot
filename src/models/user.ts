import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  birthday: { type: String, required: true },
});

export const UserSchema = mongoose.model("User", userSchema);
