import React from 'react';
import UserList from './components/UserList';
import OrderDashboard from './components/OrderDashboard';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard</h1>
      </header>
      <main className="app-main">
        <section className="card">
          <h2>Users</h2>
          <UserList />
        </section>
        <section className="card">
          <h2>Orders</h2>
          <OrderDashboard />
        </section>
      </main>
    </div>
  );
}
