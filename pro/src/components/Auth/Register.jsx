// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      setSuccess('Registration successful! Please check your email to confirm your account.');
      setError('');
      onRegister && onRegister();
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
    </form>
  );
}
