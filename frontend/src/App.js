import React, { useState } from 'react';
import './App.css';

function App() {
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const registerUser = async () => {
    // Send a POST request to your backend to register the user
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      alert(data.message); // Show registration success message
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.'); // Show error message if registration fails
    }
  };

  const loginUser = async () => {
    // Send a POST request to your backend to login the user
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      alert(data.message); // Show login success message
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.'); // Show error message if login fails
    }
  };

  return (
    <div id="formContainer">
      <h2>Register</h2>
      <form id="registerForm">
        <input type="text" id="registerUsername" name="username" placeholder="Username" value={registrationData.username} onChange={handleRegistrationChange} required />
        <input type="email" id="registerEmail" name="email" placeholder="Email" value={registrationData.email} onChange={handleRegistrationChange} required />
        <input type="password" id="registerPassword" name="password" placeholder="Password" value={registrationData.password} onChange={handleRegistrationChange} required />
        <button type="button" onClick={registerUser}>Register</button> {/* Handle click event in React */}
      </form>

      <h2>Login</h2>
      <form id="loginForm">
        <input type="text" id="loginUsername" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} required />
        <input type="password" id="loginPassword" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
        <button type="button" onClick={loginUser}>Login</button> {/* Handle click event in React */}
      </form>
    </div>
  );
}

export default App;
