import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
  },

  products: [
    {
      product: Schema.Types.ObjectId,
      quantity: Number,
    },
  ],

  total: Number,
});

export default model("Cart", cartSchema);
