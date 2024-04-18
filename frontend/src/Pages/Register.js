import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const registerUser = async () => {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*/;
    if (!passwordRegex.test(registerData.password)) {
      alert('Password must contain at least one uppercase letter, one number, and one symbol.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      navigate('/'); // Navigate to the homepage or dashboard after successful registration
      alert('User registered successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App-content"> {/* Wrap with App-content for consistent styling */}
      <h2>Register</h2>
      <form id="registerForm">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={handleRegisterChange}
          required
        />
        <small>Password must contain at least one uppercase letter, one number, and one symbol.</small>
        <button type="button" onClick={registerUser}>Register</button>
      </form>
      <div className="links">
        <Link to="/">Login</Link> | <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Register;