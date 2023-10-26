import { Schema, model } from "mongoose";
const osrsSchema = new Schema({
  discordId: String,
  osrsName: String,
  stats: Object,
});

export default model("Player", osrsSchema);
