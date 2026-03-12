import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/client';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="user-list">
      {users.map(u => (
        <div key={u.id} className="user-item">
          <div className="user-avatar">{u.name.charAt(0)}</div>
          <div className="user-info">
            <span className="user-name">{u.name}</span>
            <div className="user-contact">
              <span className="user-email">{u.email}</span>
              {u.phone && <span className="user-phone">{u.phone}</span>}
              {u.address && <span className="user-address">{u.address}</span>}
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .user-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .user-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: #f8f9fb;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .user-item:hover {
          background: #eef0f4;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-weight: 500;
          font-size: 0.95rem;
        }
        .user-contact {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-email {
          font-size: 0.82rem;
          color: #6b7280;
        }
        .user-phone {
          font-size: 0.82rem;
          color: #6b7280;
        }
        .user-phone::before {
          content: '·';
          margin-right: 0.75rem;
          color: #d1d5db;
        }
        .user-address {
          font-size: 0.82rem;
          color: #6b7280;
        }
        .user-address::before {
          content: '·';
          margin-right: 0.75rem;
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
