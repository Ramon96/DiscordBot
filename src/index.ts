require("dotenv").config();
import { ExtendedClient } from "./structures/client";
import mongoose, { ConnectOptions } from "mongoose";

export const client = new ExtendedClient();

interface ExtendedConnectOptions extends ConnectOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

const options: ExtendedConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

if (!process.env.mongoURI) {
  throw new Error("MongoURI is not defined");
}

mongoose
  .connect(process.env.mongoURI, options)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

mongoose.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.disconnect();
  console.log("MongoDB connection closed");
  client.removeAllListeners();
  console.log("Client listeners removed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.disconnect();
  console.log("MongoDB connection closed");
  client.removeAllListeners();
  console.log("Client listeners removed");
  process.exit(0);
});

client.start();
