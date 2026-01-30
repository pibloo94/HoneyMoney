import express, { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = express.Router();

// GET all projects
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find();
  res.json(projects);
}));

// GET project by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({ id: req.params.id });
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
}));

// POST create new project
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
}));

// PUT update project
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
}));

// DELETE project
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOneAndDelete({ id: req.params.id });
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({ message: 'Project deleted successfully' });
}));

export default router;
