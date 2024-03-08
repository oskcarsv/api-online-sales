import Product from '../product/product.model.js';


export const existenteProduct = async (name = '') => {
    const existeProduct = await Product.findOne({ name });

    if (existeProduct) {
        throw new Error(`The product name ${name} has already been registered`);
    }
}

export const noExisteProduct = async (name = '') => {
    const existeProduct = await Product.findOne({ name });

    if (!existeProduct) {
        throw new Error(`The product name ${name} doesn't exist`);
    }
}

export const existeProductById = async (id = '') => {
    const existeProduct = await Product.findById(id);

    if (!existeProduct) {
        throw new Error(`ID: ${id} doesn't exist`);
    }
}