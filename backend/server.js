const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic();

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 (555) 101-0001', address: '123 Maple St, Springfield, IL', designation: 'Engineering Manager' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 (555) 101-0002', address: '456 Oak Ave, Shelbyville, IL', designation: 'Software Engineer' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '+1 (555) 101-0003', address: '789 Pine Rd, Capital City, IL', designation: 'Product Designer' },
];

const orders = [
  { id: 101, item: 'Wireless Headphones', total: 59.99, status: 'Shipped', lastUpdated: '2026-06-15T10:23:00Z' },
  { id: 102, item: 'Mechanical Keyboard', total: 124.50, status: 'Processing', lastUpdated: '2026-06-16T14:05:00Z' },
  { id: 103, item: 'USB-C Hub', total: 29.00, status: 'Delivered', lastUpdated: '2026-06-17T08:47:00Z' },
];

app.get('/api/v1/users', (req, res) => res.json(users));
app.get('/api/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = users.find(u => u.id === id);
  user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});
app.get('/api/v1/orders', (req, res) => res.json(orders));

app.post('/api/v1/orders/insights', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the backend' });
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      system: 'You are an operations analyst summarizing order data for internal staff. Be concise: 2-4 sentences, plain prose, no headers or bullet lists.',
      messages: [{
        role: 'user',
        content: `Summarize the current order pipeline for an operations dashboard. Highlight anything needing attention (e.g. orders stuck in Processing). Orders data:\n${JSON.stringify(orders, null, 2)}`,
      }],
    });
    const summary = response.content.find(block => block.type === 'text')?.text || '';
    res.json({ summary });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      res.status(500).json({ error: 'Invalid ANTHROPIC_API_KEY' });
    } else if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: 'Rate limited by Claude API, try again shortly' });
    } else if (err instanceof Anthropic.APIError) {
      res.status(502).json({ error: `Claude API error: ${err.message}` });
    } else {
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
