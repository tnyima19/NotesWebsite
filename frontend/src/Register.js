import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase-config'; // Adjusted import path
import { signInWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  return (
    <>
      <h2>Register</h2>
      <form id="registerForm">
        {/* Include your form fields here */}
      </form>
      <div className="links">
        <Link to="/">Login</Link> | <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </>
  );
};

export default Register;
