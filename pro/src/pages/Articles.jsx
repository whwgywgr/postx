// src/pages/Articles.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from('articles').select('*').order('id', { ascending: false });
      if (!error) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
    // Listen for articleDeleted event
    const handleArticleDeleted = () => {
      setLoading(true);
      fetchArticles();
    };
    window.addEventListener('articleDeleted', handleArticleDeleted);
    return () => window.removeEventListener('articleDeleted', handleArticleDeleted);
  }, []);

  // Tambah fungsi handleDelete untuk padam artikel
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setLoading(true);
    // First delete all comments associated with this article
    await supabase.from('comments').delete().eq('article_id', id);
    // Then delete the article
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id));
      window.dispatchEvent(new Event('articleDeleted'));
    } else {
      alert('Failed to delete article: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="articles-page app-container">
      <h2>Articles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <img
                src={article.image_url || undefined}
                alt={article.title}
                className="article-card-img"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/article.svg';
                }}
              />
              <div className="article-card-body">
                <h3>{article.title}</h3>
                <p className="article-card-desc">{article.description || (article.content ? article.content.substring(0, 100) + '...' : '')}</p>
                {/* Future: <Link to={`/articles/${article.id}`}>Read more</Link> */}
                <button className="btn-delete" onClick={() => handleDelete(article.id)} style={{marginTop:'0.5rem'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
