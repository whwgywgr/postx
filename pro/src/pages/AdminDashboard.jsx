// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Outlet, NavLink } from 'react-router-dom';
import '../App.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: usersData } = await supabase.from('profiles').select('id, username, email, role, created_at');
    const { data: articlesData } = await supabase.from('articles').select('id, title, author_id, created_at');
    const { data: reportsData } = await supabase.from('reports').select('id, article_id, user_id, reason, created_at');
    setUsers(usersData || []);
    setArticles(articlesData || []);
    setReports(reportsData || []);
    setLoading(false);
  }

  // User CRUD
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowUserForm(true);
  };
  const handleDeleteUser = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('Failed to delete user: ' + error.message);
      return;
    }
    fetchData();
  };
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update(formData).eq('id', selectedUser.id);
    if (error) {
      alert('Failed to update user: ' + error.message);
      return;
    }
    setShowUserForm(false);
    setSelectedUser(null);
    fetchData();
  };

  // Article CRUD
  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setFormData(article);
    setShowArticleForm(true);
  };
  const handleDeleteArticle = async (id) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      alert('Failed to delete article: ' + error.message);
      return;
    }
    fetchData();
  };
  const handleArticleFormSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('articles').update(formData).eq('id', selectedArticle.id);
    if (error) {
      alert('Failed to update article: ' + error.message);
      return;
    }
    setShowArticleForm(false);
    setSelectedArticle(null);
    fetchData();
  };

  return (
    <div className="admin-dashboard app-container">
      <nav className="admin-nav">
        <h3>Admin Menu</h3>
        <ul>
          <li><NavLink to="." end>Dashboard</NavLink></li>
          <li><NavLink to="users">User Management</NavLink></li>
          <li><NavLink to="articles">Article Management</NavLink></li>
          <li><NavLink to="comments">Comment Management</NavLink></li>
          <li><NavLink to="roles">Roles & Permissions</NavLink></li>
          <li><NavLink to="analytics">Analytics</NavLink></li>
          <li><NavLink to="reporting">Reporting</NavLink></li>
          <li><NavLink to="data">Data Management</NavLink></li>
          <li><NavLink to="settings">Settings</NavLink></li>
          <li><NavLink to="notifications">Notifications</NavLink></li>
          <li><NavLink to="security">Security & Privacy</NavLink></li>
        </ul>
      </nav>
      <main className="admin-main">
        <Outlet context={{
          users,
          setUsers,
          articles,
          setArticles,
          reports,
          setReports,
          loading,
          setLoading,
          selectedUser,
          setSelectedUser,
          selectedArticle,
          setSelectedArticle,
          showUserForm,
          setShowUserForm,
          showArticleForm,
          setShowArticleForm,
          formData,
          setFormData,
          fetchData,
          handleEditUser,
          handleDeleteUser,
          handleUserFormSubmit,
          handleEditArticle,
          handleDeleteArticle,
          handleArticleFormSubmit
        }} />
      </main>
    </div>
  );
}
