import mongoose from "mongoose";

const collection = "Users";
const schema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const userService = mongoose.models.Users || mongoose.model(collection, schema);

export default userService;
