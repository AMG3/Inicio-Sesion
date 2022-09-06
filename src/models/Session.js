import mongoose from "mongoose";

const collection = "Sessions";
const schema = mongoose.Schema(
  {
    email: String,
    role: String,
  },
  { timestamps: true }
);

const sessionService = mongoose.model(collection, schema);

export default sessionService;
