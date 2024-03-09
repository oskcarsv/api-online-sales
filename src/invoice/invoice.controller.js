import { response, request } from "express";
import User from '../user/user.model.js';
import Cart from '../cart/cart.model.js';
import Invoice from './invoice.model.js';
import Product from '../product/product.model.js';

export const createInvoice = async (req = request, res = response) => {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('products.product');

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const invoiceItems = cart.products.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
    }));

    let subTotal = 0;
    for (let item of invoiceItems) {
        const product = await Product.findById(item.productId);
        subTotal += product.price * item.quantity;
    }
    const iva = subTotal * 0.12;
    const total = subTotal + iva;

    const invoice = new Invoice({
        user: user._id,
        items: invoiceItems,
        subTotal,
        iva,
        total,
        status: 'PENDING',
        paymentMethod: 'CARD'
    });

    await Invoice.populate(invoice, [
        {
            path: 'user',
            select: 'username -_id' 
        },
        {
            path: 'items.productId',
            select: 'name -_id'
        }
    ]);

    invoice.user = invoice.user.username;
    invoice.items = invoice.items.map(item => ({
        product: item.productId.name,
        quantity: item.quantity
    }));

    cart.products = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json(invoice);
};