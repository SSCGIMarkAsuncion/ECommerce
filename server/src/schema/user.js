import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";

export const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user"
  },
}, { timestamps: true }
);

export const User = mongoose.model("user", UserSchema, COLLECTIONS.USERS);