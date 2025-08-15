import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb.js";
import { hash } from "../encryption.js";
import { validatePassword } from "../error.js";
import { History } from "./history.js";

export const UserShippingSchema = new mongoose.Schema({
  lastName: {
    type: String,
    default: ""
  },
  firstName: {
    type: String,
    default: ""
  },
  middleName: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  area: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    default: ""
  }
}, { _id: false });

export const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    validate: {
      validator: (v) => {
        const validateResult = validatePassword(v);
        if (validateResult.length > 0) {
          return Promise.reject(new Error(validateResult.join('\n')));
        }
        return Promise.resolve(true);
      }
    },
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user"
  },
  shipping: UserShippingSchema
}, { timestamps: true }
);

UserSchema.pre("save", async function(next) {
  this.password = hash(this.password);
  next();
});

UserSchema.post("findOneAndDelete", async function(doc) {
    const hist = await History.insertOne({
      type: "delete",
      schema: COLLECTIONS.USERS,
      data: doc
    });

    console.log(hist);
});

UserSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  
  if (update.password) {
    const validateResult = validatePassword(update.password);
    if (validateResult.length > 0) {
      return next(new Error(validateResult.join('\n')));
    }

    update.password = hash(update.password);
  }
  if (update.$set && update.$set.password) {
    const validateResult = validatePassword(update.$set.password);
    if (validateResult.length > 0) {
      return next(new Error(validateResult.join('\n')));
    }

    update.$set.password = hash(update.$set.password);
  }

  next();
});

export const User = mongoose.model("user", UserSchema, COLLECTIONS.USERS);