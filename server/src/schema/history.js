import mongoose from "mongoose";
import { COLLECTIONS } from "../mongodb";

/*
 add
  data{
    // array for addMany
    id: [<schema._id>]
  }
 edit
  data{
    <before_modified>
  }
 delete
  data{
    <before_delete>
  }
*/
export const HistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["add", "edit", "delete"]
  },
  schema: {
    type: String,
    required: true,
    enum: Object.values(COLLECTIONS)
  },
  // any valid
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

HistorySchema.pre("save", function(next) {

});

export const History = mongoose.model(COLLECTIONS.HISTORY, HistorySchema, COLLECTIONS.HISTORY);