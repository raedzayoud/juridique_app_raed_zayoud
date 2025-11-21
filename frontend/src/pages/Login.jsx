import React, { useState } from 'react'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')

    let hasClientError = false
    if (!email.trim()) {
      setEmailError('Veuillez saisir votre email')
      hasClientError = true
    }
    if (!password.trim()) {
      setPasswordError('Veuillez saisir votre mot de passe')
      hasClientError = true
    }
    if (hasClientError) return

    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      location.href = '/'
    } catch (e) {
      const res = e.response?.data
      if (Array.isArray(res?.errors)) {
        for (const err of res.errors) {
          if (err.param === 'email') setEmailError(err.msg || 'Email invalide')
          if (err.param === 'password') setPasswordError(err.msg || 'Mot de passe invalide')
        }
        if (!res.message) setError('Certains champs sont invalides')
      } else {
        setError(res?.message || 'Erreur de connexion')
      }
    }
  }

  return (
    <form 
      onSubmit={submit}
      style={{
        maxWidth: 360,
        margin: '10vh auto',
        display: 'grid',
        gap: 16,
        padding: 24,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        fontFamily: 'system-ui'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Connexion</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: emailError ? '1px solid #b00020' : '1px solid #ccc'
        }}
      />
      {emailError && (
        <div style={{ color: '#b00020', fontSize: 13 }}>{emailError}</div>
      )}

      <input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: passwordError ? '1px solid #b00020' : '1px solid #ccc'
        }}
      />
      {passwordError && (
        <div style={{ color: '#b00020', fontSize: 13 }}>{passwordError}</div>
      )}

      {error && (
        <div style={{
          color: '#b00020',
          background: '#ffebee',
          padding: 10,
          borderRadius: 6,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        style={{
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: 'none',
          background: '#1976d2',
          color: 'white',
          cursor: 'pointer',
          transition: '0.2s'
        }}
        onMouseOver={e => e.target.style.background = '#0d47a1'}
        onMouseOut={e => e.target.style.background = '#1976d2'}
      >
        Se connecter
      </button>
    </form>
  )
}
