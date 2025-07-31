import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";
import { encrypt } from "../encryption.js";
import { validatePassword } from "../error.js";

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
  const validateResult = validatePassword(this.password);
  if (validateResult.length > 0) {
    return next(new Error(validateResult.join('\n')));
  }
  this.password = encrypt(this.password);
  next();
});

UserSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  
  if (update.password) {
    const validateResult = validatePassword(update.password);
    if (validateResult.length > 0) {
      return next(new Error(validateResult.join('\n')));
    }
    update.password = encrypt(update.password);
  }
  
  if (update.$set && update.$set.password) {
    const validateResult = validatePassword(update.$set.password);
    if (validateResult.length > 0) {
      return next(new Error(validateResult.join('\n')));
    }
    update.$set.password = encrypt(update.$set.password);
  }

  next();
});

export const User = mongoose.model("user", UserSchema, COLLECTIONS.USERS);