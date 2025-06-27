import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../dist/app.js'
import { createMockDb } from './mockDb.js'
import { Timestamp } from 'firebase-admin/firestore'
import { mockValidApplication, mockInvalidApplication } from './constants.js'

test('GET /api/applications/load returns 200 on valid input', async () => {
  const app = buildApp(createMockDb({
    applications: [mockValidApplication]
  }))

  const res = await app.inject({
        method: 'GET',
        url: `/api/applications/load?entity_id=${mockValidApplication.application_id}`,
    })

  assert.strictEqual(res.statusCode, 200)
  const body = JSON.parse(res.payload)
  assert.ok(body.application_id)
  await app.close()
})

test('GET /api/applications/load returns 400 on missing fields', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'GET',
    url: '/api/applications/load',
    payload: {
    }
  })
  assert.strictEqual(res.statusCode, 400)
  await app.close()
})
