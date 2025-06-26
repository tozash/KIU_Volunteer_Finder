import { FastifyPluginAsync } from 'fastify'

const users: FastifyPluginAsync = async (app) => {
  app.get('/random', async (_req, reply) => {
    const snapshot = await app.db.collection('users').get()
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (users.length === 0) {
      return reply.code(404).send({ message: 'No users found' })
    }

    const randomUser = users[Math.floor(Math.random() * users.length)]
    return reply.send(randomUser)
  })

  app.get('/:user_id', async (req, reply) => {
    const { user_id } = req.params as { user_id: string }
    const doc = await app.db.collection('users').doc(user_id).get()

    if (!doc.exists) {
      return reply.code(404).send({ message: 'User not found' })
    }

    return reply.send({ id: doc.id, ...doc.data() })
  })
}

export default users