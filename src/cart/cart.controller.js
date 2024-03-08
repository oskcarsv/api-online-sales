import Cart from './cart.model.js';
import Product from '../product/product.model.js';
import User from '../user/user.model.js';

export const addToCart = async (req, res) => {
    const { productName, quantity, username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findOne({ name: productName });

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
        cart = new Cart({ user: user._id, products: [], total: 0 });
    }

    const productInCart = cart.products.find(item => item.product.toString() === product._id.toString());

    if (productInCart) {
        productInCart.quantity += Number(quantity);
        cart.total += product.price * Number(quantity);
    } else {
        cart.products.push({ product: product._id, quantity: Number(quantity) });
        cart.total += product.price * Number(quantity);
    }

    await cart.save();

    // Crear una copia del carrito para modificarlo antes de devolverlo
    const cartToReturn = cart.toObject();

    // Reemplazar el ID del usuario por el nombre de usuario
    cartToReturn.user = user.username;

    // Reemplazar los ID de los productos por los nombres de los productos
    cartToReturn.products = await Promise.all(cartToReturn.products.map(async (item) => {
        const productDetails = await Product.findById(item.product);
        return {
            name: productDetails.name,
            price: productDetails.price,
            quantity: item.quantity
        };
    }));

    res.status(200).json({ message: 'Product added to cart', cart: cartToReturn });
};