const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validateContact, validateContactUpdate } = require('../models/contact');

/**
 * Get all contacts
 */
const getAllContacts = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single contact by ID
 */
const getContactById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    const db = mongodb.getDb();
    const contactId = new ObjectId(req.params.id);
    const contact = await db.collection('contacts').findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new contact
 */
const createContact = async (req, res) => {
  try {
    const contactData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    // Validate contact data
    const validation = validateContact(contactData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const result = await db.collection('contacts').insertOne(contactData);

    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an existing contact
 */
const updateContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }

    const contactData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    // Validate contact data
    const validation = validateContactUpdate(contactData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const db = mongodb.getDb();
    const contactId = new ObjectId(req.params.id);

    const result = await db.collection('contacts').updateOne(
      { _id: contactId },
      { $set: contactData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a contact
 */
const deleteContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }

    const db = mongodb.getDb();
    const contactId = new ObjectId(req.params.id);

    const result = await db.collection('contacts').deleteOne({ _id: contactId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
