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
            <th>Item</th>
            <th>Total</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const color = statusColors[o.status] || { bg: '#f3f4f6', text: '#374151' };
            return (
              <tr key={o.id}>
                <td className="order-id">#{o.id}</td>
                <td>{o.item}</td>
                <td className="order-total">${o.total.toFixed(2)}</td>
                <td>
                  <span className="status-badge" style={{ background: color.bg, color: color.text }}>
                    {o.status}
                  </span>
                </td>
                <td className="order-date">
                  {o.lastUpdated ? new Date(o.lastUpdated).toLocaleString() : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {orders.length > 0 && (
        <div className="order-summary">
          <div className="summary-stat">
            <span className="summary-label">Total Orders</span>
            <span className="summary-value">{orders.length}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">Total Value</span>
            <span className="summary-value">
              ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </span>
          </div>
          {Object.entries(
            orders.reduce((counts, o) => {
              counts[o.status] = (counts[o.status] || 0) + 1;
              return counts;
            }, {})
          ).map(([status, count]) => {
            const color = statusColors[status] || { bg: '#f3f4f6', text: '#374151' };
            return (
              <div className="summary-stat" key={status}>
                <span className="summary-label">
                  <span className="status-badge" style={{ background: color.bg, color: color.text }}>
                    {status}
                  </span>
                </span>
                <span className="summary-value">{count}</span>
              </div>
            );
          })}
        </div>
      )}
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
        .order-date {
          color: #6b7280;
          font-size: 0.88rem;
        }
        .order-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 2px solid #e5e7eb;
        }
        .summary-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .summary-label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
        }
        .summary-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
