import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      navigate('/dashboard'); // Update with your success route
      alert('Logged in successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App-content">
      <h2>Login</h2> {/* Updated title */}
      <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleLoginChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
          required
        />
        <button type="button" onClick={loginUser}>Login</button>
      </form>
      <div className="links">
        <Link to="/register">Register</Link> | <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Login;
