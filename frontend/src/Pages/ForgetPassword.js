import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('If an account exists with the email provided, a password reset link will be sent to your email.');
    } catch (error) {
      console.error("Error during password reset:", error);
      alert('If an account exists with the email provided, a password reset link will be sent to your email.');
    }
  };

  return (
    <div className="App-content"> {/* Wrap with App-content for consistent styling */}
      <h2>Forgot Password</h2>
      <form id="forgotPasswordForm" onSubmit={handleForgotPassword}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="links">
        <Link to="/">Login</Link> | <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
