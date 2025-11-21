import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Users() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'agent' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: '' })

  const load = async () => setItems((await api.get('/users')).data)
  useEffect(() => { load() }, [])

  const add = async () => { 
    setError(''); setFieldErrors({ nom: '', prenom: '', email: '', motDePasse: '', role: '' })
    const fe = { nom: '', prenom: '', email: '', motDePasse: '', role: '' }
    let invalid = false
    if (!form.nom.trim()) { fe.nom = 'Saisissez le nom'; invalid = true }
    if (!form.prenom.trim()) { fe.prenom = 'Saisissez le prénom'; invalid = true }
    if (!form.email.trim()) { fe.email = 'Saisissez l\'email'; invalid = true }
    if (!form.motDePasse.trim()) { fe.motDePasse = 'Saisissez le mot de passe'; invalid = true }
    if (!form.role.trim()) { fe.role = 'Sélectionnez un rôle'; invalid = true }
    if (invalid) { setFieldErrors(fe); return }
    try {
      await api.post('/users', form)
      setForm({ nom: '', prenom: '', email: '', motDePasse: '', role: 'agent' })
      load()
    } catch (e) {
      const res = e.response?.data
      if (Array.isArray(res?.errors)) {
        const next = { nom: '', prenom: '', email: '', motDePasse: '', role: '' }
        for (const err of res.errors) if (next.hasOwnProperty(err.param)) next[err.param] = err.msg || 'Champ invalide'
        setFieldErrors(next)
        if (!res.message) setError('Certains champs sont invalides')
      } else {
        setError(res?.message || 'Erreur lors de la création')
      }
    }
  }

  const save = async () => {
    if (!editingId) return
    setError(''); setFieldErrors({ nom: '', prenom: '', email: '', motDePasse: '', role: '' })
    const fe = { nom: '', prenom: '', email: '', motDePasse: '', role: '' }
    let invalid = false
    if (!form.nom.trim()) { fe.nom = 'Saisissez le nom'; invalid = true }
    if (!form.prenom.trim()) { fe.prenom = 'Saisissez le prénom'; invalid = true }
    if (!form.email.trim()) { fe.email = 'Saisissez l\'email'; invalid = true }
    if (!form.role.trim()) { fe.role = 'Sélectionnez un rôle'; invalid = true }
    if (invalid) { setFieldErrors(fe); return }
    const payload = { ...form }
    if (!payload.motDePasse) delete payload.motDePasse
    try {
      await api.put(`/users/${editingId}`, payload)
      setEditingId(null)
      setForm({ nom: '', prenom: '', email: '', motDePasse: '', role: 'agent' })
      load()
    } catch (e) {
      const res = e.response?.data
      if (Array.isArray(res?.errors)) {
        const next = { nom: '', prenom: '', email: '', motDePasse: '', role: '' }
        for (const err of res.errors) if (next.hasOwnProperty(err.param)) next[err.param] = err.msg || 'Champ invalide'
        setFieldErrors(next)
        if (!res.message) setError('Certains champs sont invalides')
      } else {
        setError(res?.message || 'Erreur lors de la mise à jour')
      }
    }
  }

  const startEdit = (u) => {
    setEditingId(u.id)
    setForm({ nom: u.nom, prenom: u.prenom, email: u.email, motDePasse: '', role: u.role || 'agent' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ nom: '', prenom: '', email: '', motDePasse: '', role: 'agent' })
  }

  const del = async (id) => { 
    try {
      await api.delete(`/users/${id}`)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Suppression impossible')
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h2>Utilisateurs</h2>

      {/* Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 12, marginBottom: 16 }}>
        <input 
          placeholder="Nom" 
          value={form.nom} 
          onChange={e => setForm({ ...form, nom: e.target.value })} 
          style={{ padding: 6, borderRadius: 4, border: fieldErrors.nom ? '1px solid #b00020' : '1px solid #ccc' }}
        />
        <input 
          placeholder="Prénom" 
          value={form.prenom} 
          onChange={e => setForm({ ...form, prenom: e.target.value })} 
          style={{ padding: 6, borderRadius: 4, border: fieldErrors.prenom ? '1px solid #b00020' : '1px solid #ccc' }}
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
          style={{ padding: 6, borderRadius: 4, border: fieldErrors.email ? '1px solid #b00020' : '1px solid #ccc' }}
        />
        <input 
          placeholder="Mot de passe" 
          type="password" 
          value={form.motDePasse} 
          onChange={e => setForm({ ...form, motDePasse: e.target.value })} 
          style={{ padding: 6, borderRadius: 4, border: fieldErrors.motDePasse ? '1px solid #b00020' : '1px solid #ccc' }}
        />
        <select 
          value={form.role} 
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ padding: 6, borderRadius: 4, border: fieldErrors.role ? '1px solid #b00020' : '1px solid #ccc' }}
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button 
          onClick={editingId ? save : add} 
          style={{ padding: 6, borderRadius: 4, backgroundColor: '#1E40AF', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
        {editingId && (
          <button 
            onClick={cancelEdit}
            style={{ padding: 6, borderRadius: 4, backgroundColor: '#6B7280', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Annuler
          </button>
        )}
      </div>
      {Object.values(fieldErrors).some(Boolean) && (
        <div style={{ color: '#b00020', fontSize: 12, marginTop: -8, marginBottom: 8 }}>Veuillez corriger les champs en rouge.</div>
      )}
      {error && (
        <div style={{ color: '#b00020', background: '#ffebee', padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>
      )}

      {/* Users list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(u => (
          <li 
            key={u.id} 
            style={{ 
              border: '1px solid #E5E7EB', 
              borderRadius: 8, 
              padding: 12, 
              marginBottom: 12, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <div>
              <strong>{u.prenom} {u.nom}</strong> - {u.email} ({u.role})
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => startEdit(u)} 
                style={{ padding: '4px 8px', borderRadius: 4, backgroundColor: '#0EA5E9', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Modifier
              </button>
              <button 
                onClick={() => del(u.id)} 
                style={{ padding: '4px 8px', borderRadius: 4, backgroundColor: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer' }}
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
