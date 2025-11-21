import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret'

const { default: app, initDbAndSeed } = await import('../../src/app.js')

let token

beforeAll(async () => {
  await initDbAndSeed()
})

describe('Auth + Communes CRUD', () => {
  it('logs in with admin credentials and returns JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin123!' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()
    token = res.body.token
  })

  it('creates a commune (admin only)', async () => {
    const res = await request(app)
      .post('/api/communes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nom: 'Paris', codePostal: '75000' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
  })

  it('lists communes', async () => {
    const res = await request(app)
      .get('/api/communes')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})
