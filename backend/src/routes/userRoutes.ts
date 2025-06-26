import { FastifyPluginAsync } from 'fastify'
import { LoadEntityRequest}  from '../types/requests/loadEntityRequest';
import { getEntityById} from '../services/entityService';
import { User } from '../types/models/user';

const users: FastifyPluginAsync = async (app) => {
  // load event
  app.get<{ Querystring: LoadEntityRequest }>(
    '/load',
    async (req, reply) => {
      try {
        const { entity_id } = req.query;

        if (!entity_id) {
          return reply.code(400).send({ message: 'Missing user ID', entity_id: '' });
        }

        const application = await getEntityById<User>(app, 'users', entity_id);

        return reply.code(200).send(application);
      } catch (err: any) {
        console.error('❌ Error in /load:', err);
        const status = err.message.includes('not found') ? 404 : 500;
        return reply.code(status).send({ message: err.message });
      }
    }
  );

  // load random user
  app.get('/random', async (_req, reply) => {
    const snapshot = await app.db.collection('users').get()
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (users.length === 0) {
      return reply.code(404).send({ message: 'No users found' })
    }

    const randomUser = users[Math.floor(Math.random() * users.length)]
    return reply.send(randomUser)
  })
}

export default users