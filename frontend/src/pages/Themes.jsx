import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Themes() {
  const [items, setItems] = useState([])
  const [nom, setNom] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [nomError, setNomError] = useState('')

  const load = async () => setItems((await api.get('/themes')).data)
  useEffect(() => { load() }, [])

  const add = async () => {
    setError(''); setNomError('')
    if (!nom.trim()) { setNomError('Veuillez saisir le nom du thème'); return }
    try {
      await api.post('/themes', { nom })
      setNom('')
      load()
    } catch (e) {
      const res = e.response?.data
      setError(res?.message || 'Erreur lors de la création')
    }
  }

  const save = async () => {
    if (!editingId) return
    setError(''); setNomError('')
    if (!nom.trim()) { setNomError('Veuillez saisir le nom du thème'); return }
    try {
      await api.put(`/themes/${editingId}`, { nom })
      setEditingId(null)
      setNom('')
      load()
    } catch (e) {
      const res = e.response?.data
      setError(res?.message || 'Erreur lors de la mise à jour')
    }
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setNom(t.nom)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNom('')
  }

  const del = async (id) => {
    try {
      await api.delete(`/themes/${id}`)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Suppression impossible')
    }
  }

  const container = {
    maxWidth: 500,
    margin: '5vh auto',
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'grid',
    gap: 20
  }

  const inputRow = {
    display: 'flex',
    gap: 8
  }

  const inputStyle = {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: nomError ? '1px solid #b00020' : '1px solid #ccc',
    fontSize: 15
  }

  const addBtn = {
    padding: '10px 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer'
  }

  const list = {
    display: 'grid',
    gap: 10,
    padding: 0,
    listStyle: 'none'
  }

  const itemCard = {
    padding: 12,
    background: '#f8f9fa',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const deleteBtn = {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer'
  }

  return (
    <div style={container}>
      <h2 style={{ margin: 0 }}>Thèmes</h2>

      <div style={inputRow}>
        <input
          placeholder="Nom du thème"
          value={nom}
          onChange={e => setNom(e.target.value)}
          style={inputStyle}
        />
        {nomError && <div style={{ color: '#b00020', fontSize: 12, alignSelf: 'center' }}>{nomError}</div>}
        <button onClick={editingId ? save : add} style={addBtn}>
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
        {editingId && (
          <button onClick={cancelEdit} style={{ ...addBtn, background: '#6b7280' }}>Annuler</button>
        )}
      </div>
      {error && (
        <div style={{ color: '#b00020', background: '#ffebee', padding: 10, borderRadius: 6 }}>
          {error}
        </div>
      )}

      <ul style={list}>
        {items.map(t => (
          <li key={t.id} style={itemCard}>
            <span>{t.nom}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(t)} style={{ ...deleteBtn, background: '#0ea5e9' }}>Modifier</button>
              <button onClick={() => del(t.id)} style={deleteBtn}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
