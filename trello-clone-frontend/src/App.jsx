

// src/App.jsx (UPDATED - Add ProjectBoard Route)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard'; // <--- Import ProjectBoard

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading authentication...</div>;
  }
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>You need to log in to view this page.</p>
        <Link to="/login" style={{ color: '#64b5f6', textDecoration: 'underline' }}>Go to Login</Link>
      </div>
    );
  }
  return children;
};

function App() {
  const { user, signOut } = useAuth();

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
          {user && (
            <li>
              <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#a7e170', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' }}>
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Welcome to Trello Clone!</h1>
                <p>Please register or log in to get started.</p>
            </div>
        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <--- UNCOMMENT OR ADD THIS ROUTE */}
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// Wrap the App component with AuthProvider
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;