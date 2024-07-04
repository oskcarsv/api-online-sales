"use strict";

import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    price: {
      type: Number,
      required: [true, "The price is required"],
    },
    stock: {
      type: Number,
      required: [true, "The stock is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "The category is required"],
    },
    status: {
      type: String,
      enum: ["IN_STOCK", "SOLD_OUT", "DELETED"],
      default: "IN_STOCK",
    },
  },
  {
    versionKey: false,
  },
);

export default model("Product", productSchema);
