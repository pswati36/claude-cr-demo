import React, { useEffect, useState } from 'react';
import { fetchOrders, fetchOrderInsights } from '../api/client';

const statusColors = {
  Shipped: { bg: '#dbeafe', text: '#1d4ed8' },
  Processing: { bg: '#fef3c7', text: '#b45309' },
  Delivered: { bg: '#d1fae5', text: '#047857' },
};

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(null);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(console.error);
  }, []);

  const generateInsights = () => {
    setInsightsLoading(true);
    setInsightsError(null);
    fetchOrderInsights()
      .then(({ summary }) => setInsights(summary))
      .catch(err => setInsightsError(err.message))
      .finally(() => setInsightsLoading(false));
  };

  return (
    <div className="order-table-wrapper">
      <div className="ai-insights">
        <div className="ai-insights-header">
          <span className="ai-insights-title">AI Insights</span>
          <button
            className="ai-insights-button"
            onClick={generateInsights}
            disabled={insightsLoading}
          >
            {insightsLoading ? 'Thinking…' : insights ? 'Regenerate' : 'Generate summary'}
          </button>
        </div>
        {insightsError && <p className="ai-insights-error">{insightsError}</p>}
        {insights && !insightsError && <p className="ai-insights-text">{insights}</p>}
      </div>
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
        .ai-insights {
          margin-bottom: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 0.5rem;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
        }
        .ai-insights-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .ai-insights-title {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6d28d9;
        }
        .ai-insights-button {
          font-size: 0.82rem;
          font-weight: 600;
          color: #6d28d9;
          background: #fff;
          border: 1px solid #ddd6fe;
          border-radius: 0.375rem;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
        }
        .ai-insights-button:hover:not(:disabled) {
          background: #ede9fe;
        }
        .ai-insights-button:disabled {
          cursor: default;
          opacity: 0.7;
        }
        .ai-insights-text {
          margin: 0.6rem 0 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #3730a3;
        }
        .ai-insights-error {
          margin: 0.6rem 0 0;
          font-size: 0.9rem;
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}
