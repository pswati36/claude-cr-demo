const API_BASE = '/api/v1';

export const fetchUsers = () => fetch(`${API_BASE}/users`).then(r => r.json());
export const fetchUser = (id) => fetch(`${API_BASE}/users/${id}`).then(r => r.json());
export const fetchOrders = () => fetch(`${API_BASE}/orders`).then(r => r.json());
