import express, { Request, Response } from 'express';
import { Project } from '../models/Project.js';

const router = express.Router();

// GET all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// GET project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
});

// POST create new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error });
  }
});

// PUT update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
});

// DELETE project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

export default router;
