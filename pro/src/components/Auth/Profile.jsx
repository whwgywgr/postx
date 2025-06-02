// src/components/Auth/Profile.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import '../../App.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('https://ui-avatars.com/api/?name=User&background=2b7cff&color=fff');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        setProfile(profile);
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
        else if (user.email) setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=2b7cff&color=fff`);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleResetPassword = async () => {
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) setMessage('Failed to send reset email.');
    else setMessage('Password reset email sent!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    // Supabase does not require old password for update
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage('Failed to change password.');
    else {
      setMessage('Password changed successfully!');
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <div className="profile-container app-container">
      <h2>My Profile</h2>
      <div className="profile-header">
        <img className="profile-avatar" src={avatarUrl} alt="avatar" />
        <div className="profile-info">
          <div className="profile-username">{profile?.username || user.email}</div>
          <div className="profile-email">{user.email}</div>
        </div>
      </div>
      <div className="profile-actions">
        <button onClick={handleResetPassword}>Reset Password (Email)</button>
        <button onClick={() => setShowChangePassword((v) => !v)}>
          {showChangePassword ? 'Cancel Change Password' : 'Change Password'}
        </button>
      </div>
      {showChangePassword && (
        <form className="profile-password-form" onSubmit={handleChangePassword}>
          {/* <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required /> */}
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit">Update Password</button>
        </form>
      )}
      {message && <div className="profile-message">{message}</div>}
    </div>
  );
}
