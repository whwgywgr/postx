import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

const initialArticle = {
  title: '',
  content: '',
};

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(initialArticle);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // for supabase row id

  // Fetch articles from supabase
  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from('articles').select('*').order('id', { ascending: false });
      if (!error) setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Update article
      const { data, error } = await supabase
        .from('articles')
        .update(form)
        .eq('id', editId)
        .select();
      if (error) {
        alert('Error updating article: ' + error.message);
        return;
      }
      if (data) {
        setArticles(articles.map((a) => (a.id === editId ? data[0] : a)));
        setEditId(null);
        setEditIndex(null);
      }
    } else {
      // Insert article
      const { data, error } = await supabase
        .from('articles')
        .insert([form])
        .select();
      if (error) {
        alert('Error adding article: ' + error.message);
        return;
      }
      if (data) setArticles([data[0], ...articles]);
    }
    setForm(initialArticle);
  };

  const handleEdit = (idx) => {
    setForm({ title: articles[idx].title, content: articles[idx].content });
    setEditIndex(idx);
    setEditId(articles[idx].id);
  };

  const handleDelete = async (idx) => {
    const id = articles[idx].id;
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    await supabase.from('comments').delete().eq('article_id', id);
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      setArticles(articles.filter((_, i) => i !== idx));
      if (editIndex === idx) {
        setForm(initialArticle);
        setEditIndex(null);
        setEditId(null);
      }
      // Dispatch custom event to notify Articles.jsx
      window.dispatchEvent(new Event('articleDeleted'));
    } else {
      alert('Failed to delete article: ' + error.message);
    }
  };

  return (
    <div className="article-manager-page app-container">
      <h2>Manage Articles</h2>
      <form className="article-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          rows={5}
        />
        <div className="article-form-actions">
          <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Article</button>
          {editIndex !== null && (
            <button type="button" className="btn-cancel" onClick={() => { setForm(initialArticle); setEditIndex(null); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="article-list">
        {articles.map((article, idx) => (
          <div key={article.id} className="article-list-item card">
            <div className="article-list-content">
              <h3>{article.title}</h3>
              <p className="article-list-snippet">{article.content.length > 120 ? article.content.substring(0, 120) + '...' : article.content}</p>
            </div>
            <div className="article-list-actions">
              <button onClick={() => handleEdit(idx)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleManager;
