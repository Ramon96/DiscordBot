const mongoose = require("mongoose");
const hottieSchema = new mongoose.Schema({
  id: String,
  count: Number,
});

module.exports = mongoose.model("Hottie", hottieSchema);
