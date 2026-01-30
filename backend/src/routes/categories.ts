import express, { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = express.Router();

// GET all categories
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
}));

// GET category by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ id: req.params.id });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
}));

// POST create new category
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
}));

// PUT update category
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
}));

// DELETE category
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOneAndDelete({ id: req.params.id });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json({ message: 'Category deleted successfully' });
}));

export default router;
