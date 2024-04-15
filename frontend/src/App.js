import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';
import './App.css'; // Ensure your CSS file is imported

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>NoteScape</h1>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
