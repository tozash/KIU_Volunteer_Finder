import Fastify from 'fastify'
import userRoutes from './routes/users'
import { db } from './firebase'

const app = Fastify()

// Decorate Fastify with Firestore instance
app.decorate('db', db)

// Register routes
app.register(userRoutes, { prefix: '/api/users' })

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
