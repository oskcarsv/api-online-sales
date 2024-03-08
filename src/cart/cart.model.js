import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "The user is required"]
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

export default model('Cart', cartSchema);