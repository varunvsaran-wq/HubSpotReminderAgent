const express = require('express');
const router = express.Router();
const { getStaleContacts, getAllContacts } = require('../services/contactService');

// GET /api/contacts — all contacts with days_since_activity
router.get('/', (req, res) => {
  try {
    const contacts = getAllContacts();
    res.json({ contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load contacts' });
  }
});

// GET /api/contacts/stale?threshold=14 — contacts not touched in >= threshold days
router.get('/stale', (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 14;
    if (![7, 14, 30].includes(threshold) && (threshold < 1 || threshold > 365)) {
      return res.status(400).json({ error: 'threshold must be between 1 and 365' });
    }
    const contacts = getStaleContacts(threshold);
    res.json({ contacts, threshold, count: contacts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load stale contacts' });
  }
});

module.exports = router;
