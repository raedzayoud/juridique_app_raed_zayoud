import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Communes() {
  const [items, setItems] = useState([])
  const [nom, setNom] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [nomError, setNomError] = useState('')
  const [cpError, setCpError] = useState('')

  const load = async () => setItems((await api.get('/communes')).data)
  useEffect(() => { load() }, [])

  const add = async () => {
    setError(''); setNomError(''); setCpError('')
    let invalid = false
    if (!nom.trim()) { setNomError('Veuillez saisir le nom'); invalid = true }
    if (!codePostal.trim()) { setCpError('Veuillez saisir le code postal'); invalid = true }
    if (invalid) return
    try {
      await api.post('/communes', { nom, codePostal })
      setNom('')
      setCodePostal('')
      load()
    } catch (e) {
      const res = e.response?.data
      setError(res?.message || 'Erreur lors de la création')
    }
  }

  const save = async () => {
    if (!editingId) return
    setError(''); setNomError(''); setCpError('')
    let invalid = false
    if (!nom.trim()) { setNomError('Veuillez saisir le nom'); invalid = true }
    if (!codePostal.trim()) { setCpError('Veuillez saisir le code postal'); invalid = true }
    if (invalid) return
    try {
      await api.put(`/communes/${editingId}`, { nom, codePostal })
      setEditingId(null)
      setNom('')
      setCodePostal('')
      load()
    } catch (e) {
      const res = e.response?.data
      setError(res?.message || 'Erreur lors de la mise à jour')
    }
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setNom(c.nom)
    setCodePostal(c.codePostal)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNom('')
    setCodePostal('')
  }

  const del = async (id) => {
    try {
      await api.delete(`/communes/${id}`)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Suppression impossible')
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 700, margin: "20px auto" }}>
      <h2 style={{ marginBottom: 16 }}>Communes</h2>

      {/* Formulaire */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: 12,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: 20
        }}
      >
        <input
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: nomError ? '1px solid #b00020' : '1px solid #ccc',
            flex: 1
          }}
        />
        {nomError && <div style={{ color: '#b00020', fontSize: 12, alignSelf: 'center' }}>{nomError}</div>}
        <input
          placeholder="Code postal"
          value={codePostal}
          onChange={e => setCodePostal(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: cpError ? '1px solid #b00020' : '1px solid #ccc',
            width: 140
          }}
        />
        {cpError && <div style={{ color: '#b00020', fontSize: 12, alignSelf: 'center' }}>{cpError}</div>}
        <button
          onClick={editingId ? save : add}
          style={{
            padding: "10px 16px",
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
          onMouseOver={(e) => e.target.style.background = '#0d47a1'}
          onMouseOut={(e) => e.target.style.background = '#1976d2'}
        >
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
        {editingId && (
          <button
            onClick={cancelEdit}
            style={{
              padding: "10px 16px",
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14
            }}
            onMouseOver={(e) => e.target.style.background = '#4b5563'}
            onMouseOut={(e) => e.target.style.background = '#6b7280'}
          >
            Annuler
          </button>
        )}
      </div>
      {error && (
        <div style={{ color: '#b00020', background: '#ffebee', padding: 10, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Liste des communes */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(c => (
          <li
            key={c.id}
            style={{
              background: '#fafafa',
              padding: 12,
              borderRadius: 6,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #eee'
            }}
          >
            <span style={{ fontSize: 15 }}>
              <strong>{c.nom}</strong> — {c.codePostal}
            </span>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => startEdit(c)}
                style={{
                  padding: "6px 12px",
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#0284c7'}
                onMouseOut={(e) => e.target.style.background = '#0ea5e9'}
              >
                Modifier
              </button>
              <button
                onClick={() => del(c.id)}
                style={{
                  padding: "6px 12px",
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.background = '#9a0007'}
                onMouseOut={(e) => e.target.style.background = '#d32f2f'}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
