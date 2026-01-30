import express, { Request, Response } from 'express';
import { Transaction } from '../models/Transaction.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = express.Router();

// GET all transactions
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
}));

// GET transaction by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findOne({ id: req.params.id });
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json(transaction);
}));

// POST create new transaction
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.status(201).json(transaction);
}));

// PUT update transaction
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json(transaction);
}));

// DELETE transaction
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findOneAndDelete({ id: req.params.id });
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  res.json({ message: 'Transaction deleted successfully' });
}));

// POST bulk create transactions
router.post('/bulk', asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.insertMany(req.body);
  res.status(201).json(transactions);
}));

export default router;
