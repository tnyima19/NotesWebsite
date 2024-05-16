// ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="top-bar">NoteScape</div>
      <div className="App-content">
        <h2>Forgot Password</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="button" onClick={handleResetPassword}>Reset Password</button>
        </form>
        <div className="links">
          <Link to="/login">Login</Link> | <Link to="/signup">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
