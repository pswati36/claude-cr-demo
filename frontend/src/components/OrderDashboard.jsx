import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/client';

const statusColors = {
  Shipped: { bg: '#dbeafe', text: '#1d4ed8' },
  Processing: { bg: '#fef3c7', text: '#b45309' },
  Delivered: { bg: '#d1fae5', text: '#047857' },
};

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <div className="order-table-wrapper">
      <table className="order-table" role="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const color = statusColors[o.status] || { bg: '#f3f4f6', text: '#374151' };
            return (
              <tr key={o.id}>
                <td className="order-id">#{o.id}</td>
                <td className="order-total">${o.total.toFixed(2)}</td>
                <td>
                  <span className="status-badge" style={{ background: color.bg, color: color.text }}>
                    {o.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <style>{`
        .order-table-wrapper {
          overflow-x: auto;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
        }
        .order-table th {
          text-align: left;
          padding: 0.6rem 1rem;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          border-bottom: 2px solid #e5e7eb;
        }
        .order-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.92rem;
        }
        .order-table tbody tr:hover {
          background: #f8f9fb;
        }
        .order-id {
          font-weight: 600;
          color: #4f46e5;
        }
        .order-total {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
