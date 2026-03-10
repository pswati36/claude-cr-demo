const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 (555) 101-0001' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 (555) 101-0002' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '+1 (555) 101-0003' },
];

const orders = [
  { id: 101, total: 59.99, status: 'Shipped' },
  { id: 102, total: 124.50, status: 'Processing' },
  { id: 103, total: 29.00, status: 'Delivered' },
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
