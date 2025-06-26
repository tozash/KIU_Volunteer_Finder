import Fastify from 'fastify'
import applicationRoutes from './routes/applicationRoutes'
import userRoutes from './routes/userRoutes'
import eventRoutes from './routes/eventRoutes'
import { db } from './plugins/firebase'

const app = Fastify()

// Decorate Fastify with Firestore instance
app.decorate('db', db)

// Register routes
app.register(userRoutes, { prefix: '/api/users' })
app.register(applicationRoutes, { prefix: '/api/applications' })
app.register(eventRoutes, { prefix: '/api/events' })

const start = async () => {
  try {
    await app.listen({ port: 3000 })
    console.log('✅ Fastify API running at http://localhost:3000')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
