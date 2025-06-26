import { FastifyPluginAsync } from 'fastify';
import { CreateApplicationRequest } from '../types/requests/createApplicationRequest';
import { ApplicationStatusResponse } from '../types/responses/applicationStatusResponse';
import {
  createApplication,
  linkApplicationToEvent,
  linkApplicationToUser,
  updateApplicationStatus
} from '../services/applicationService';
import { UpdateApplicationStatusRequest } from '../types/requests/updateApplicationStatusRequest';

const applicationRoutes: FastifyPluginAsync = async (app) => {
  // apply for application
  app.post<{ Body: CreateApplicationRequest; Reply: ApplicationStatusResponse }>(
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

  // update application status
  app.post<{ Body: UpdateApplicationStatusRequest; Reply: ApplicationStatusResponse }>(
    '/update',
    async (req, reply) => {
      try {
        const { application_id, updated_application_status } = req.body;

        if (!application_id || !updated_application_status) {
          return reply.code(400).send({ message: 'Invalid input', application_id: '' });
        }

        const application = await updateApplicationStatus(app, application_id, updated_application_status);
        console.log(`✅ Changed application status to ${application_id} to ${updated_application_status}`);;

        return reply.code(201).send({
          message: `Application status changed to ${updated_application_status}`,
          application_id: application_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: err.message, application_id: '' });
      }
    }
  );
};

export default applicationRoutes;
