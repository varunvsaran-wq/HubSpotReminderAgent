require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');
const digestRouter = require('./routes/digest');

const app = express();

// Allow all origins — frontend and API share the same domain on Vercel
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/digest', digestRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    claudeConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

// Listen only in local dev — Vercel runs this as a serverless function
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`\n  IFG Reminder Agent API running at http://localhost:${PORT}`);
    console.log(`  Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓ configured' : '✗ missing ANTHROPIC_API_KEY'}\n`);
  });
}

module.exports = app;
