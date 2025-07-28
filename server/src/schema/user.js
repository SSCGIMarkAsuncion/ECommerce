import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";
import { encrypt } from "../encryption.js";

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

UserSchema.pre("save", function(next) {
  this.password = encrypt(this.password);
  next();
});

export const User = mongoose.model("user", UserSchema, COLLECTIONS.USERS);