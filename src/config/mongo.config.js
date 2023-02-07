import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.set("strictQuery", false);

export const connection = mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
