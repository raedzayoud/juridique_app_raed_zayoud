import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import Communes from './Communes.jsx'
import Themes from './Themes.jsx'
import Users from './Users.jsx'
import Interventions from './Interventions.jsx'
import ProtectedRoute from '../shared/ProtectedRoute.jsx'

export default function App() {
  const token = localStorage.getItem('token')
  
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      {/* Navigation bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        padding: '12px 24px',
        backgroundColor: '#4b7edbff', // nice blue
        borderRadius: 8,
        color: '#fff',
      }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
        <Link to="/communes" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Communes</Link>
        <Link to="/themes" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Thèmes</Link>
        <Link to="/users" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Utilisateurs</Link>
        <Link to="/interventions" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Interventions</Link>
        <div style={{ marginLeft: 'auto' }}>
          {token ? (
            <button 
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href='/login' }}
              style={{
                backgroundColor: '#DC2626',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/communes" element={<ProtectedRoute><Communes /></ProtectedRoute>} />
        <Route path="/themes" element={<ProtectedRoute><Themes /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="/interventions" element={<ProtectedRoute><Interventions /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
