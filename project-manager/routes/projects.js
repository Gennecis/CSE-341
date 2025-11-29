const router = require('express').Router();
const projectsController = require('../controllers/projects');
const { isAuthenticated } = require('../middleware/auth');

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
 * @summary Create a new project (requires authentication)
 * @tags Projects
 * @param {object} request.body.required - Project data
 * @return {object} 201 - Created project ID
 * @return {object} 400 - Validation error
 * @return {object} 401 - Authentication required
 * @return {object} 500 - Internal server error
 */
router.post('/', isAuthenticated, projectsController.createProject);

/**
 * PUT /projects/{id}
 * @summary Update an existing project (requires authentication)
 * @tags Projects
 * @param {string} id.path.required - Project ID
 * @param {object} request.body.required - Project data
 * @return {null} 204 - Successfully updated
 * @return {object} 400 - Invalid project ID or validation error
 * @return {object} 401 - Authentication required
 * @return {object} 404 - Project not found
 * @return {object} 500 - Internal server error
 */
router.put('/:id', isAuthenticated, projectsController.updateProject);

/**
 * DELETE /projects/{id}
 * @summary Delete a project (requires authentication)
 * @tags Projects
 * @param {string} id.path.required - Project ID
 * @return {null} 204 - Successfully deleted
 * @return {object} 400 - Invalid project ID
 * @return {object} 401 - Authentication required
 * @return {object} 404 - Project not found
 * @return {object} 500 - Internal server error
 */
router.delete('/:id', isAuthenticated, projectsController.deleteProject);

module.exports = router;
