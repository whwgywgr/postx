// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    // Ambil profile user dari table profiles
    const userId = data.user.id;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (profileError) {
      setError('Gagal ambil data profile.');
      return;
    }
    if (profile.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    onLogin && onLogin();
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
