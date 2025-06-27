import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../dist/app.js'
import { createMockDb } from './mockDb.js'

test('POST /api/applications/create returns 201 on valid input', async () => {
  const app = buildApp(createMockDb({
    users: [mockUser],
    events: [mockEvent],
    applications: []
  }));

  const payload = {
    user_id: mockUser.user_id,
    event_id: mockEvent.event_id,
    answers: {
      "Why do you want to volunteer?": "To give back",
      "Do you have previous experience?": "Yes"
    }
  };

  const res = await app.inject({
    method: 'POST',
    url: '/api/applications/create',
    payload
  });

  assert.strictEqual(res.statusCode, 201);
  const body = JSON.parse(res.payload);
  assert.strictEqual(body.message, 'Application submitted');
  assert.ok(body.entity_id);
  await app.close();
});

test('POST /api/events returns 400 for missing fields', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    payload: { title: 'Clean-up Day' } // Missing location, date, etc.
  })
  assert.strictEqual(res.statusCode, 400)
  await app.close()
})

test('POST /api/events returns 201 for valid event', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'POST',
    url: '/api/events',
    payload: {
      title: 'Clean-up Day',
      location: 'Park',
      date: '2025-06-30',
      description: 'Trash clean-up mission.'
    }
  })
  assert.strictEqual(res.statusCode, 201)
  const body = JSON.parse(res.payload)
  assert.ok(body.event_id)
  await app.close()
})

test('GET /api/events returns an empty array when no events exist', async () => {
  const app = buildApp(createMockDb())
  const res = await app.inject({
    method: 'GET',
    url: '/api/events'
  })
  assert.strictEqual(res.statusCode, 200)
  const body = JSON.parse(res.payload)
  assert.deepStrictEqual(body, [])
  await app.close()
})
