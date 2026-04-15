require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');
const digestRouter = require('./routes/digest');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/digest', digestRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    claudeConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n  IFG Reminder Agent API running at http://localhost:${PORT}`);
  console.log(`  Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓ configured' : '✗ missing ANTHROPIC_API_KEY'}\n`);
});
