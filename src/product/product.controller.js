import { response, request } from "express";
import Product from './product.model.js';
import Category from '../category/category.model.js';

export const getProducts = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        products,
    });
}

export const createProduct = async (req, res) => {
    const { name, price, stock, category, status } = req.body;

    const categoria = await Category.findOne({ name: category });

    if (!categoria) {
        return res.status(400).json({
            mensaje: `The category name '${category}' doesn't exist`
        });
    }

    const product = new Product({
        name, price, stock, category: categoria._id, status
    });

    await product.save();

    await product.populate('category');

    const productResponse = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category.name,
        status: product.status,
    };

    res.status(200).json({
        msg: 'Product created successfully',
        product: productResponse
    });
}

export const getProductByName = async (req, res) => {
    const { name } = req.body;

    const product = await Product.findOne({ name });

    await product.populate('category');
  
    const productResponse = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category.name,
        status: product.status,
    };

    res.status(200).json({
        msg: 'Product found successfully',
        product: productResponse
    });

}

export const updateProduct = async (req, res) => {
    const { oldName, newName, price, stock, category, status } = req.body;

    const product = await Product.findOne({ name: oldName });

    const categoria = await Category.findOne({ name: category });

    if (!categoria) {
        return res.status(400).json({
            mensaje: `The category name '${category}' doesn't exist`
        });
    }

    Object.assign(product, {
        name: newName,
        price: price,
        stock: stock,
        category: categoria._id,
        status: status
    });
    await product.save();

    await product.populate('category');

    const productResponse = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category.name,
        status: product.status,
    };

    res.status(200).json({
        msg: 'Product updated successfully',
        product: productResponse
    });
}

export const getSoldOutProducts = async (req, res) => {
    const query = { stock: 0 };

    const products = await Product.find(query)
        .populate('category')
        .select('name category');

    const productResponse = products.map(product => ({
        name: product.name,
        category: product.category.name
    }));

    res.status(200).json({
        products: productResponse,
    });
}