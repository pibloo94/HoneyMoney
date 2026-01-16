import express, { Request, Response } from 'express';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();

// GET all transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// GET transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error });
  }
});

// POST create new transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error });
  }
});

// PUT update transaction
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error });
  }
});

// DELETE transaction
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ id: req.params.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

// POST bulk create transactions
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.insertMany(req.body);
    res.status(201).json(transactions);
  } catch (error) {
    res.status(400).json({ message: 'Error bulk creating transactions', error });
  }
});

export default router;
