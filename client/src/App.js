<<<<<<< HEAD
import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NotesViewPage from "./pages/NotesViewPage";


import "./App.css";

// function Navigation(props) {
//   return (
//     <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Micro Blog
//         </Link>
//         <ul className="navbar-nav me-auto">
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/posts/new">
//               Create a Micro Post
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/Login">
//               Logout
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      {/* <Navigation /> */}
      <div className="container-xl text-center">
        <div className="row justify-content-center">
          <Routes>
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Signup" element={<SignUpPage />} />
            <Route path="" element={<NotesViewPage />} />

            
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
=======
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
>>>>>>> cacb9ba (Pushing all changes to the main branch fully functional and completed)
