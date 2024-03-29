import mongoose from "mongoose";

const osrsSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  osrsName: { type: String, required: true },
  stats: { type: Object, required: false },
});

export const OsrsSchema = mongoose.model("Player", osrsSchema);
