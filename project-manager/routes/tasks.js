const router = require('express').Router();
const tasksController = require('../controllers/tasks');

/**
 * GET /tasks
 * @summary Get all tasks
 * @tags Tasks
 * @return {array<object>} 200 - An array of task objects
 * @return {object} 500 - Internal server error
 */
router.get('/', tasksController.getAllTasks);

/**
 * GET /tasks/{id}
 * @summary Get a single task by ID
 * @tags Tasks
 * @param {string} id.path.required - Task ID
 * @return {object} 200 - Task object
 * @return {object} 400 - Invalid task ID
 * @return {object} 404 - Task not found
 * @return {object} 500 - Internal server error
 */
router.get('/:id', tasksController.getTaskById);

/**
 * GET /tasks/project/{projectId}
 * @summary Get all tasks for a specific project
 * @tags Tasks
 * @param {string} projectId.path.required - Project ID
 * @return {array<object>} 200 - An array of task objects for the project
 * @return {object} 500 - Internal server error
 */
router.get('/project/:projectId', tasksController.getTasksByProject);

/**
 * POST /tasks
 * @summary Create a new task
 * @tags Tasks
 * @param {object} request.body.required - Task data
 * @return {object} 201 - Created task ID
 * @return {object} 400 - Validation error
 * @return {object} 500 - Internal server error
 */
router.post('/', tasksController.createTask);

/**
 * PUT /tasks/{id}
 * @summary Update an existing task
 * @tags Tasks
 * @param {string} id.path.required - Task ID
 * @param {object} request.body.required - Task data
 * @return {null} 204 - Successfully updated
 * @return {object} 400 - Invalid task ID or validation error
 * @return {object} 404 - Task not found
 * @return {object} 500 - Internal server error
 */
router.put('/:id', tasksController.updateTask);

/**
 * DELETE /tasks/{id}
 * @summary Delete a task
 * @tags Tasks
 * @param {string} id.path.required - Task ID
 * @return {null} 204 - Successfully deleted
 * @return {object} 400 - Invalid task ID
 * @return {object} 404 - Task not found
 * @return {object} 500 - Internal server error
 */
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
