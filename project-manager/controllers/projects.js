const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validateProject, validateProjectUpdate } = require('../models/project');

/**
 * Get all projects
 */
const getAllProjects = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const projects = await db.collection('projects').find().toArray();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single project by ID
 */
const getProjectById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const db = mongodb.getDb();
    const projectId = new ObjectId(req.params.id);
    const project = await db.collection('projects').findOne({ _id: projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const projectData = {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      budget: req.body.budget,
      owner: req.body.owner,
      priority: req.body.priority,
    };

    // Validate project data
    const validation = validateProject(projectData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const result = await db.collection('projects').insertOne(projectData);

    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create project' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an existing project
 */
const updateProject = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const projectData = {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      budget: req.body.budget,
      owner: req.body.owner,
      priority: req.body.priority,
    };

    // Validate project data
    const validation = validateProjectUpdate(projectData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const projectId = new ObjectId(req.params.id);

    // Remove undefined fields
    const updateData = Object.fromEntries(
      Object.entries(projectData).filter(([_, v]) => v !== undefined)
    );

    const result = await db.collection('projects').updateOne(
      { _id: projectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a project
 */
const deleteProject = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const db = mongodb.getDb();
    const projectId = new ObjectId(req.params.id);

    const result = await db.collection('projects').deleteOne({ _id: projectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
