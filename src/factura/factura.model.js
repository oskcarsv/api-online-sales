import mongoose from 'mongoose';

const InvoiceSchema = mongoose.Schema({
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
            type:
                Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        }
    }],
    total: {
        type: Number
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'PAID', 'CANCELED'], 
        default: 'PENDING' 
    },
    paymentMethod: {
        type: String, 
        enum: ['CARD', 'CASH', 'TRANSFER'], 
        default: 'CARD' 
    },

});

export default mongoose.model('Invoice', InvoiceSchema);
