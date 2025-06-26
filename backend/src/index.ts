import { db } from './plugins/firebase'
import { buildApp } from './app'

const app = buildApp(db)

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
