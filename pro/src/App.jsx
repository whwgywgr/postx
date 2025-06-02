import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Articles from './pages/Articles';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import ArticleManager from './pages/ArticleManager';
import AdminSettings from './pages/AdminSettings';
import AdminNotifications from './pages/AdminNotifications';
import AdminRoles from './pages/AdminRoles';
import AdminSecurity from './pages/AdminSecurity';
import AdminData from './pages/AdminData';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReporting from './pages/AdminReporting';
import AdminComments from './pages/AdminComments';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => setIsAuthenticated(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article-manager" element={isAuthenticated ? <ArticleManager /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register onRegister={() => setIsAuthenticated(true)} />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" /> }>
            <Route index element={<AdminAnalytics />} />
            <Route path="users" element={<AdminDashboardSection section="users" />} />
            <Route path="articles" element={<AdminDashboardSection section="articles" />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reporting" element={<AdminReporting />} />
            <Route path="data" element={<AdminData />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="security" element={<AdminSecurity />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function AdminDashboardSection({ section }) {
  // This component will use the Outlet context from AdminDashboard
  React.useOutletContext();
  if (section === 'users') {
    return (
      <section>
        <h3>User Management</h3>
        {/* ...user management table and form, use context for data and handlers... */}
      </section>
    );
  }
  if (section === 'articles') {
    return (
      <section>
        <h3>Article Management</h3>
        {/* ...article management table and form, use context for data and handlers... */}
      </section>
    );
  }
  return null;
}
