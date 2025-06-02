// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children, isAuthenticated, onLogout }) {
  return (
    <div className="app-layout">
      <header>
        <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
