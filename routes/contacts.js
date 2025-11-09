const express = require('express');
const router = require('express').Router();
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
// Get all contacts
router.get('/', async (req, res) => {
    try {
        const db = mongodb.getDb();
        const contacts = await db.collection('contacts').find().toArray();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
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
});

module.exports = router;