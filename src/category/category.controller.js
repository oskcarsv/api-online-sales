import { response, request } from "express";
import Category from "./category.model.js";

export const getCategories = async (req = request, res = response) => {
  const { limite, desde } = req.query;
  const query = { estado: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    categories,
  });
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = new Category({ name, description });

  await category.save();

  res.status(200).json({
    msg: "Category created successfully",
    category,
  });
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  res.status(200).json({
    category,
  });
};

export const updateCategory = async (req, res = response) => {
  const { name, estado, ...rest } = req.body;

  if (req.body.newName) {
    rest.name = req.body.newName;
  }

  await Category.findOneAndUpdate({ name }, rest);

  const categoryUpdated = await Category.findOne({ name: rest.name || name });

  res.status(200).json({
    msg: "Category successfully updated",
    categoryUpdated,
  });
};

export const deleteCategory = async (req, res = response) => {
  const { name, confirmation } = req.body;

  if (confirmation !== "YES") {
    return res.status(400).json({
      msg: "Confirmation must be YES to proceed",
    });
  }

  await Category.findOneAndUpdate({ name }, { estado: false });

  res.status(200).json({
    msg: "User successfully deleted",
  });
};
