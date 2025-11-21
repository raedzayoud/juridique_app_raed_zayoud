import { describe, it, expect, beforeAll } from 'vitest'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret'

const { sequelize, User } = await import('../../src/models/index.js')
const { initDbAndSeed } = await import('../../src/app.js')

beforeAll(async () => {
  await initDbAndSeed()
})

describe('User model password hashing and validation', () => {
  it('hashes password on create and validates correctly', async () => {
    const u = await User.create({ nom: 'Doe', prenom: 'John', email: 'john@example.com', password: 'Secret123!', role: 'agent' })
    expect(u.passwordHash).toBeDefined()
    expect(u.passwordHash).not.toEqual('Secret123!')

    const ok = await u.validatePassword('Secret123!')
    expect(ok).toBe(true)
    const wrong = await u.validatePassword('WrongPass1!')
    expect(wrong).toBe(false)
  })

  it('rehashes when updating with transient password', async () => {
    const u = await User.scope('withPassword').findOne({ where: { email: 'john@example.com' } })
    const oldHash = u.passwordHash
    u.password = 'NewSecret123!'
    await u.save()
    await u.reload()
    expect(u.passwordHash).toBeDefined()
    expect(u.passwordHash).not.toEqual(oldHash)
    const ok = await u.validatePassword('NewSecret123!')
    expect(ok).toBe(true)
  })
})
