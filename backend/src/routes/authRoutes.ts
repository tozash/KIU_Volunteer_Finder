import { FastifyPluginAsync } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string }

    if (!email || !password) {
      return reply.code(400).send({ message: 'Missing credentials' })
    }

    const snap = await app.db
      .collection('users')
      .where('email', '==', email)
      .where('password', '==', password)
      .limit(1)
      .get()

    if (snap.empty) {
      return reply.code(401).send({ message: 'Invalid email or password' })
    }

    const user = snap.docs[0].data()

    return reply.send({ token: uuidv4(), user })
  })

  app.post('/register', async (req, reply) => {
    const { name, surname, email, dob, sex, password } = req.body as {
      name: string
      surname: string
      email: string
      dob: string
      sex: string
      password: string
    }

    if (!name || !surname || !email || !dob || !sex || !password) {
      return reply.code(400).send({ message: 'Missing fields' })
    }

    const existing = await app.db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (!existing.empty) {
      return reply.code(400).send({ message: 'Email already in use' })
    }

    const user_id = uuidv4()
    const user = {
      user_id,
      first_name: name,
      last_name: surname,
      age: 0,
      sex,
      email,
      username: email,
      password,
      applications: [],
      events: [],
    }

    await app.db.collection('users').doc(user_id).set(user)

    return reply.code(201).send({ token: uuidv4(), user })
  })
}

export default authRoutes
