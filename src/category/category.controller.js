import { response, request } from "express";
import Category from './category.model.js';

export const getCategories = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        categories,
    });
}
