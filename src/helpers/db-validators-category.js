import Category from '../category/category.model.js';


export const existenteCategory = async (name = '') => {
    const existeCategory = await Category.findOne({ name });

    if (existeCategory) {
        throw new Error(`The category name ${name} has already been registered`);
    }
}

export const noExisteCategory = async (name = '') => {
    const existeCategory = await Category.findOne({ name });

    if (!existeCategory) {
        throw new Error(`The category name ${name} doesn't exist`);
    }
}


export const existeCategoryById = async (id = '') => {
    const existeCategory = await Category.findById(id);

    if (!existeCategory) {
        throw new Error(`ID: ${id} doesn't exist`);
    }
}