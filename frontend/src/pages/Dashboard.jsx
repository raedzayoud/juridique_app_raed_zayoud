import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.get('/dashboard/stats').then(r => setStats(r.data)) }, [])
  if (!stats) return 'Chargement...'

  const container = {
    maxWidth: 900,
    margin: '5vh auto',
    padding: 24,
    display: 'grid',
    gap: 24
  }

  const card = {
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }

  const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16
  }

  const statBox = {
    background: '#f8f9fa',
    padding: 16,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16
  }

  const listCard = {
    background: '#f8f9fa',
    padding: 16,
    borderRadius: 10
  }

  const list = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 8
  }

  const listItem = {
    background: '#fff',
    padding: 10,
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ margin: 0 }}>Tableau de bord</h2>

        <div style={statsGrid}>
          <div style={statBox}><strong>{stats.total}</strong><br />Total</div>
          <div style={statBox}><strong>{stats.enCours}</strong><br />En cours</div>
          <div style={statBox}><strong>{stats.traitees}</strong><br />Traitées</div>
          <div style={statBox}><strong>{stats.archivees}</strong><br />Archivées</div>
        </div>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Top 5 thèmes</h3>
        <ul style={list}>
          {stats.topThemes.map((t, i) => (
            <li key={i} style={listItem}>
              {t.Theme?.nom} — {t.count ?? 0}
            </li>
          ))}
        </ul>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Top 5 communes</h3>
        <ul style={list}>
          {stats.topCommunes.map((c, i) => (
            <li key={i} style={listItem}>
              {c.Commune?.nom} ({c.Commune?.codePostal}) — {c.count ?? 0}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
