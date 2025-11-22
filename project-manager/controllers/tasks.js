const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validateTask, validateTaskUpdate } = require('../models/task');

/**
 * Get all tasks
 */
const getAllTasks = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const tasks = await db.collection('tasks').find().toArray();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single task by ID
 */
const getTaskById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const db = mongodb.getDb();
    const taskId = new ObjectId(req.params.id);
    const task = await db.collection('tasks').findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all tasks for a specific project
 */
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const db = mongodb.getDb();
    const tasks = await db.collection('tasks').find({ projectId }).toArray();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      projectId: req.body.projectId,
      status: req.body.status,
      dueDate: req.body.dueDate,
      assignedTo: req.body.assignedTo,
      priority: req.body.priority,
    };

    // Validate task data
    const validation = validateTask(taskData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const result = await db.collection('tasks').insertOne(taskData);

    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create task' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an existing task
 */
const updateTask = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const taskData = {
      title: req.body.title,
      description: req.body.description,
      projectId: req.body.projectId,
      status: req.body.status,
      dueDate: req.body.dueDate,
      assignedTo: req.body.assignedTo,
      priority: req.body.priority,
    };

    // Validate task data
    const validation = validateTaskUpdate(taskData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const taskId = new ObjectId(req.params.id);

    // Remove undefined fields
    const updateData = Object.fromEntries(
      Object.entries(taskData).filter(([_, v]) => v !== undefined)
    );

    const result = await db.collection('tasks').updateOne(
      { _id: taskId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const db = mongodb.getDb();
    const taskId = new ObjectId(req.params.id);

    const result = await db.collection('tasks').deleteOne({ _id: taskId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};
