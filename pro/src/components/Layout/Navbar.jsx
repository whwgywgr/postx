// src/components/Layout/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FaBars } from 'react-icons/fa';

export default function Navbar({ isAuthenticated, onLogout }) {
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role);
      } else {
        setRole(null);
      }
    };
    if (isAuthenticated) getRole();
    else setRole(null);
  }, [isAuthenticated]);

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">Mesra</Link>
          <button className="navbar-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(m => !m)}>
            <FaBars />
          </button>
        </div>
        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/article-manager">Create Article</Link>
          {role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <button className="navbar-logout" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
