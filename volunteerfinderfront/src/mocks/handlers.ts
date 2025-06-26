import { rest } from 'msw'
import { dummyEvents, dummyApplications } from '@/lib/dummyData'

let events = [...dummyEvents]
let applications = [...dummyApplications]

export const handlers = [
  rest.get('/events', (req, res, ctx) => {
    const search = req.url.searchParams.get('search')?.toLowerCase() ?? ''
    const filtered = events.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.location.toLowerCase().includes(search),
    )
    return res(ctx.status(200), ctx.json(filtered))
  }),
  rest.get('/events/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    const event = events.find((e) => e.id === id)
    return res(ctx.status(200), ctx.json(event))
  }),
  rest.post('/events', async (req, res, ctx) => {
    const body = await req.json()
    const newEvent = { ...body, id: events.length + 1 }
    events.push(newEvent)
    return res(ctx.status(201), ctx.json(newEvent))
  }),
  rest.post('/events/:id/applications', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const newApp = {
      id: applications.length + 1,
      eventId: id,
      name: 'Alice',
      status: 'pending' as const,
    }
    applications.push(newApp)
    return res(ctx.status(201), ctx.json(newApp))
  }),
  rest.patch('/applications/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const body = await req.json()
    const app = applications.find((a) => a.id === id)
    if (app) app.status = body.status
    return res(ctx.status(200), ctx.json(app))
  }),
  rest.get('/applications', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(applications))
  }),
  rest.post('/auth/register', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user: { id: 1, name: 'Alice' } })),
  ),
  rest.post('/auth/login', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user: { id: 1, name: 'Alice' } })),
  ),
]
