// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NotesViewPage from './pages/NotesViewPage';
import Homepage from './pages/Homepage';
import Notes from './components/Notes';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // Import the ForgotPasswordPage
import './App.css';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AuthRedirect({ component: Component }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to={`/users/${currentUser.uid}/homepage`} /> : <Component />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthRedirect component={LoginPage} />} />
          <Route path="/signup" element={<AuthRedirect component={SignUpPage} />} />
          <Route path="/forgot-password" element={<AuthRedirect component={ForgotPasswordPage} />} />
          <Route path="/users/:userId/homepage" element={<PrivateRoute><Homepage /></PrivateRoute>} />
          <Route path="/users/:userId/folders/:folderId/notes/new" element={<PrivateRoute><Notes isNew={true} /></PrivateRoute>} />
          <Route path="/users/:userId/folders/:folderId/notes/:noteId" element={<PrivateRoute><Notes isNew={false} /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
