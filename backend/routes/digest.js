const express = require('express');
const router = express.Router();
const { getStaleContacts } = require('../services/contactService');
const { generateSuggestions } = require('../services/claudeService');

// POST /api/digest/generate
// Body: { threshold: 14 }
// Returns stale contacts enriched with AI next_action + draft_message
router.post('/generate', async (req, res) => {
  try {
    const threshold = parseInt(req.body.threshold) || 14;
    const contacts = getStaleContacts(threshold);

    if (!contacts.length) {
      return res.json({ contacts: [], threshold, message: 'No contacts need follow-up at this threshold.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(400).json({ error: 'ANTHROPIC_API_KEY not configured in .env' });
    }

    const suggestions = await generateSuggestions(contacts);

    const enriched = contacts.map((c) => ({
      ...c,
      next_action: suggestions[String(c.id)]?.next_action || null,
      draft_message: suggestions[String(c.id)]?.draft_message || null,
    }));

    res.json({ contacts: enriched, threshold, count: enriched.length });
  } catch (err) {
    console.error('Digest generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate digest' });
  }
});

module.exports = router;
