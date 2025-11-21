import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Interventions() {
  const [items, setItems] = useState([])
  const [communes, setCommunes] = useState([])
  const [themes, setThemes] = useState([])
  const [form, setForm] = useState({ communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' })
  const [uploadingId, setUploadingId] = useState(null)

  const load = async () => {
    setItems((await api.get('/interventions')).data)
    setCommunes((await api.get('/communes')).data)
    setThemes((await api.get('/themes')).data)
  }

  useEffect(() => { load() }, [])

  const add = async () => { 
    setError('')
    setFieldErrors({ communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' })
    let invalid = false
    const f = { ...form }
    const nextErr = { communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' }
    if (!f.communeId) { nextErr.communeId = 'Sélectionnez une commune'; invalid = true }
    if (!f.themeId) { nextErr.themeId = 'Sélectionnez un thème'; invalid = true }
    if (!String(f.nomUsager).trim()) { nextErr.nomUsager = 'Saisissez le nom'; invalid = true }
    if (!String(f.prenomUsager).trim()) { nextErr.prenomUsager = 'Saisissez le prénom'; invalid = true }
    if (!String(f.question).trim()) { nextErr.question = 'Saisissez la question'; invalid = true }
    if (invalid) { setFieldErrors(nextErr); return }
    try {
      await api.post('/interventions', form)
      setForm({ communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' })
      load()
    } catch (e) {
      const res = e.response?.data
      // Map possible express-validator errors
      if (Array.isArray(res?.errors)) {
        const fe = { communeId: '', themeId: '', nomUsager: '', prenomUsager: '', question: '' }
        for (const err of res.errors) {
          if (fe.hasOwnProperty(err.param)) fe[err.param] = err.msg || 'Champ invalide'
        }
        setFieldErrors(fe)
        if (!res.message) setError('Certains champs sont invalides')
      } else {
        setError(res?.message || 'Erreur lors de la création')
      }
    }
  }

  const respond = async (id) => {
    const reponse = prompt('Réponse:')
    if (reponse) {
      await api.post(`/interventions/${id}/repondre`, { reponse, statut: 'traitee' })
      load()
    }
  }

  const changeStatus = async (id, statut) => { 
    await api.post(`/interventions/${id}/statut`, { statut })
    load()
  }

  const onFileChange = async (id, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingId(id)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('interventionId', String(id))
      await api.post('/pieces/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await load()
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  const statusColor = (status) => {
    switch(status) {
      case 'en_cours': return '#FACC15' // yellow
      case 'traitee': return '#22C55E'  // green
      case 'archivee': return '#6B7280' // gray
      default: return '#000'
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h2>Interventions</h2>
      {/* Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 12, marginBottom: 16 }}>
        <select value={form.communeId} onChange={e => setForm({ ...form, communeId: Number(e.target.value) })} style={{ padding: 6, borderRadius: 4, border: fieldErrors.communeId ? '1px solid #b00020' : '1px solid #ccc' }}>
          <option value="">Commune</option>
          {communes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        {fieldErrors.communeId && <div style={{ color: '#b00020', fontSize: 12, alignSelf: 'center' }}>{fieldErrors.communeId}</div>}
        <select value={form.themeId} onChange={e => setForm({ ...form, themeId: Number(e.target.value) })} style={{ padding: 6, borderRadius: 4, border: fieldErrors.themeId ? '1px solid #b00020' : '1px solid #ccc' }}>
          <option value="">Thème</option>
          {themes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
        </select>
        {fieldErrors.themeId && <div style={{ color: '#b00020', fontSize: 12, alignSelf: 'center' }}>{fieldErrors.themeId}</div>}
        <input placeholder="Nom usager" value={form.nomUsager} onChange={e => setForm({ ...form, nomUsager: e.target.value })} style={{ padding: 6, borderRadius: 4, border: fieldErrors.nomUsager ? '1px solid #b00020' : '1px solid #ccc' }} />
        <input placeholder="Prénom usager" value={form.prenomUsager} onChange={e => setForm({ ...form, prenomUsager: e.target.value })} style={{ padding: 6, borderRadius: 4, border: fieldErrors.prenomUsager ? '1px solid #b00020' : '1px solid #ccc' }} />
        <input placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} style={{ padding: 6, borderRadius: 4, border: fieldErrors.question ? '1px solid #b00020' : '1px solid #ccc' }} />
        <button onClick={add} style={{ padding: 6, borderRadius: 4, backgroundColor: '#1E40AF', color: '#fff', border: 'none', cursor: 'pointer' }}>Créer</button>
      </div>
      {Object.values(fieldErrors).some(Boolean) && (
        <div style={{ color: '#b00020', fontSize: 12, marginTop: -8, marginBottom: 8 }}>Veuillez corriger les champs en rouge.</div>
      )}
      {error && (
        <div style={{ color: '#b00020', background: '#ffebee', padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>
      )}

      {/* List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(it => (
          <li key={it.id} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 500, color: statusColor(it.statut) }}>
                [{it.statut}] {it.nomUsager} {it.prenomUsager}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => respond(it.id)} style={{ padding: '4px 8px', borderRadius: 4, border: 'none', backgroundColor: '#22C55E', color: '#fff', cursor: 'pointer' }}>Répondre</button>
                <select value={it.statut} onChange={e => changeStatus(it.id, e.target.value)} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="en_cours">En cours</option>
                  <option value="traitee">Traitée</option>
                  <option value="archivee">Archivée</option>
                </select>
                <label style={{ cursor: 'pointer', color: '#1E40AF', fontWeight: 500 }}>
                  {uploadingId === it.id ? 'Envoi...' : 'Ajouter une pièce'}
                  <input type="file" style={{ display: 'none' }} onChange={e => onFileChange(it.id, e)} />
                </label>
              </div>
            </div>
            <div style={{ color: '#6B7280', marginBottom: 8 }}>{it.question}</div>
            {Array.isArray(it.PieceJointes) && it.PieceJointes.length > 0 && (
              <ul>
                {it.PieceJointes.map(pj => (
                  <li key={pj.id}><a href={pj.url} target="_blank" rel="noreferrer" style={{ color: '#1E40AF', textDecoration: 'underline' }}>{pj.type}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
