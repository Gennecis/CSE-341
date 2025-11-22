const router = require('express').Router();
const projectsController = require('../controllers/projects');

/**
 * GET /projects
 * @summary Get all projects
 * @tags Projects
 * @return {array<object>} 200 - An array of project objects
 * @return {object} 500 - Internal server error
 */
router.get('/', projectsController.getAllProjects);

/**
 * GET /projects/{id}
 * @summary Get a single project by ID
 * @tags Projects
 * @param {string} id.path.required - Project ID
 * @return {object} 200 - Project object
 * @return {object} 400 - Invalid project ID
 * @return {object} 404 - Project not found
 * @return {object} 500 - Internal server error
 */
router.get('/:id', projectsController.getProjectById);

/**
 * POST /projects
 * @summary Create a new project
 * @tags Projects
 * @param {object} request.body.required - Project data
 * @return {object} 201 - Created project ID
 * @return {object} 400 - Validation error
 * @return {object} 500 - Internal server error
 */
router.post('/', projectsController.createProject);

/**
 * PUT /projects/{id}
 * @summary Update an existing project
 * @tags Projects
 * @param {string} id.path.required - Project ID
 * @param {object} request.body.required - Project data
 * @return {null} 204 - Successfully updated
 * @return {object} 400 - Invalid project ID or validation error
 * @return {object} 404 - Project not found
 * @return {object} 500 - Internal server error
 */
router.put('/:id', projectsController.updateProject);

/**
 * DELETE /projects/{id}
 * @summary Delete a project
 * @tags Projects
 * @param {string} id.path.required - Project ID
 * @return {null} 204 - Successfully deleted
 * @return {object} 400 - Invalid project ID
 * @return {object} 404 - Project not found
 * @return {object} 500 - Internal server error
 */
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
