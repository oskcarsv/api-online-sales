import { Schema, model } from "mongoose";


const invoiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    subTotal: {
        type: Number
    },
    iva: {
        type: Number
    },
    total: {
        type: Number
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'PAID', 'CANCELED'], 
        default: 'PAID' 
    },
    paymentMethod: {
        type: String, 
        enum: ['CARD', 'CASH', 'TRANSFER'], 
        default: 'CARD' 
    },

});

export default model('Invoice', invoiceSchema);
