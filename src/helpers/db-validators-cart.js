import User from '../user/user.model.js';
import Product from '../product/product.model.js';


export const noExisteProduct = async (name = '') => {
    const existeProduct = await Product.findOne({ name });

    if (!existeProduct) {
        throw new Error(`The product name ${name} doesn't exist`);
    }
}

export const noExisteUsername = async (username = '') => {
    const existeUsername = await User.findOne({ username });

    if (!existeUsername) {
        throw new Error(`The username ${username} doesn't exist`);
    }
}
