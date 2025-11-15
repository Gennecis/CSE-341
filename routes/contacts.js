const router = require('express').Router();
const contactsController = require('../controllers/contacts');

/**
 * GET /contacts
 * @summary Get all contacts
 * @tags Contacts
 * @return {array<object>} 200 - An array of contact objects
 * @return {object} 500 - Internal server error
 */
router.get('/', contactsController.getAllContacts);

/**
 * GET /contacts/{id}
 * @summary Get a single contact by ID
 * @tags Contacts
 * @param {string} id.path.required - Contact ID
 * @return {object} 200 - Contact object
 * @return {object} 400 - Invalid contact ID
 * @return {object} 404 - Contact not found
 * @return {object} 500 - Internal server error
 */
router.get('/:id', contactsController.getContactById);

/**
 * POST /contacts
 * @summary Create a new contact
 * @tags Contacts
 * @param {object} request.body.required - Contact data
 * @return {object} 201 - Created contact ID
 * @return {object} 400 - Validation error
 * @return {object} 500 - Internal server error
 */
router.post('/', contactsController.createContact);

/**
 * PUT /contacts/{id}
 * @summary Update an existing contact
 * @tags Contacts
 * @param {string} id.path.required - Contact ID
 * @param {object} request.body.required - Contact data
 * @return {null} 204 - Successfully updated
 * @return {object} 400 - Invalid contact ID or validation error
 * @return {object} 404 - Contact not found
 * @return {object} 500 - Internal server error
 */
router.put('/:id', contactsController.updateContact);

/**
 * DELETE /contacts/{id}
 * @summary Delete a contact
 * @tags Contacts
 * @param {string} id.path.required - Contact ID
 * @return {null} 204 - Successfully deleted
 * @return {object} 400 - Invalid contact ID
 * @return {object} 404 - Contact not found
 * @return {object} 500 - Internal server error
 */
router.delete('/:id', contactsController.deleteContact);

module.exports = router;