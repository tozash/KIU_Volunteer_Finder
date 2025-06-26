import Fastify, { FastifyInstance } from 'fastify'
import applicationRoutes from './routes/applicationRoutes'
import userRoutes from './routes/userRoutes'
import eventRoutes from './routes/eventRoutes'

export function buildApp(db: any): FastifyInstance {
  const app = Fastify()
  app.decorate('db', db)
  app.register(userRoutes, { prefix: '/api/users' })
  app.register(applicationRoutes, { prefix: '/api/applications' })
  app.register(eventRoutes, { prefix: '/api/events' })
  return app
}
