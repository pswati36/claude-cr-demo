const API_BASE = '/api/v1';

export const fetchUsers = () => fetch(`${API_BASE}/users`).then(r => r.json());
export const fetchUser = (id) => fetch(`${API_BASE}/users/${id}`).then(r => r.json());
export const fetchOrders = () => fetch(`${API_BASE}/orders`).then(r => r.json());
export const fetchOrderInsights = () =>
  fetch(`${API_BASE}/orders/insights`, { method: 'POST' }).then(async r => {
    const body = await r.json();
    if (!r.ok) throw new Error(body.error || 'Failed to generate insights');
    return body;
  });
