import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../dist/app.js'

function createMockDb(initialUsers = []) {
  const users = [...initialUsers]
  return {
    collection(name) {
      if (name !== 'users') throw new Error('Unexpected collection ' + name)
      return {
        get: async () => ({
          docs: users.map(u => ({ data: () => u }))
        }),
        doc: id => ({
          set: async data => { users.push({ ...data, user_id: id }) },
          get: async () => {
            const user = users.find(u => u.user_id === id)
            return { exists: !!user, data: () => user }
          },
          update: async updates => {
            const idx = users.findIndex(u => u.user_id === id)
            if (idx !== -1) users[idx] = { ...users[idx], ...updates }
          }
        })
      }
    }
  }
}

test('POST /api/users/signup returns 400 on missing fields', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'POST',
    url: '/api/users/signup',
    payload: { first_name: 'John' }
  })
  assert.strictEqual(res.statusCode, 400)
  await app.close()
})

test('GET /api/users/random returns 404 when empty', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({ method: 'GET', url: '/api/users/random' })
  assert.strictEqual(res.statusCode, 404)
  await app.close()
})

test('GET /api/users/random returns a user when available', async () => {
  const mockUser = { user_id: 'id1', first_name: 'a', last_name: 'b' }
  const app = buildApp(createMockDb([mockUser]))
  const res = await app.inject({ method: 'GET', url: '/api/users/random' })
  assert.strictEqual(res.statusCode, 200)
  const data = JSON.parse(res.payload)
  assert.strictEqual(data.user_id, 'id1')
  await app.close()
})
