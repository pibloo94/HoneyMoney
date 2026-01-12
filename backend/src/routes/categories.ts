import express, { Request, Response } from 'express';
import { Category } from '../models/Category.js';

const router = express.Router();

// GET all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// GET category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
});

// POST create new category
router.post('/', async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
});

// PUT update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
});

// DELETE category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

export default router;
