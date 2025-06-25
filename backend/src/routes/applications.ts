import { FastifyPluginAsync } from 'fastify';
import { CreateApplicationRequest } from '../types/requests/createApplicationRequest';
import { CreateApplicationResponse } from '../types/responses/createApplicationResponse';
import {
  createApplication,
  linkApplicationToEvent,
  linkApplicationToUser
} from '../services/applicationService';

const applicationsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateApplicationRequest; Reply: CreateApplicationResponse }>(
    '/apply',
    async (req, reply) => {
      try {
        const { user_id, event_id, answers } = req.body;

        if (!user_id || !event_id || !answers || typeof answers !== 'object') {
          return reply.code(400).send({ message: 'Invalid input', application_id: '' });
        }

        const application = await createApplication(app, user_id, event_id, answers);
        console.log(`✅ Created application ${application.application_id}`);

        await linkApplicationToEvent(app, event_id, application.application_id);
        console.log(`📌 Linked to event ${event_id}`);

        await linkApplicationToUser(app, user_id, application.application_id);
        console.log(`👤 Linked to user ${user_id}`);

        return reply.code(201).send({
          message: 'Application submitted',
          application_id: application.application_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: err.message, application_id: '' });
      }
    }
  );
};

export default applicationsRoutes;
