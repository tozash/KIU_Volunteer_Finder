import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../dist/app.js'
import { createMockDb } from './mockDb.js'
import { mockInvalidApplication, mockInvalidSignUpRequest, mockUser, mockValidSignUpRequest } from './constants.js'

test('POST /api/users/signup returns 400 on missing fields', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'POST',
    url: '/api/users/signup',
    payload: { ...mockInvalidSignUpRequest }
  })
  assert.strictEqual(res.statusCode, 400)
  await app.close()
})

test('POST /api/users/signup returns 201 on valid input', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'POST',
    url: '/api/users/signup',
    payload: { ...mockValidSignUpRequest }
  })
  assert.strictEqual(res.statusCode, 201)
  const body = JSON.parse(res.payload)
  assert.strictEqual(body.message, 'User registered successfully')
  await app.close()
})

test('GET /api/users/login returns 201 on valid input', async () => {
  const app = buildApp(createMockDb({
      users: [mockUser]
    }))

  const res = await app.inject({
    method: 'GET',
    url: '/api/users/login',
    query: { 
        user_identifier: mockUser.username,
        password: mockUser.password
    }
  })
  assert.strictEqual(res.statusCode, 201)
  const body = JSON.parse(res.payload)
  assert.strictEqual(body.message, 'User registered successfully')
  await app.close()
})

test('GET /api/users/random returns 200 when at least one user exists', async () => {
  const app = buildApp(createMockDb({
      users: [mockUser]
    }))
    
  const res = await app.inject({
    method: 'GET',
    url: '/api/users/random'
  })
  assert.strictEqual(res.statusCode, 404)
  await app.close()
})

test('GET /api/users/random returns 404 when no users exist', async () => {
  const app = buildApp(createMockDb())

  const res = await app.inject({
    method: 'GET',
    url: '/api/users/random'
  })
  assert.strictEqual(res.statusCode, 404)
  await app.close()
})