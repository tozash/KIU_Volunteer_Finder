import { FastifyPluginAsync } from 'fastify';
import { Application } from '../types/models/application';
import { CreateApplicationRequest } from '../types/requests/createApplicationRequest';
import { EntityUpdateStatusResponse } from '../types/responses/entityUpdateStatusResponse';
import {
  createApplication,
  linkApplicationToEvent,
  linkApplicationToUser,
  updateApplicationStatus
} from '../services/applicationService';
import {
  getEntityById
} from '../services/entityService';
import { UpdateApplicationStatusRequest } from '../types/requests/updateApplicationStatusRequest';
import {LoadEntityRequest} from '../types/requests/loadEntityRequest';

const applications: FastifyPluginAsync = async (app) => {
  // load application
  app.get<{ Querystring: LoadEntityRequest }>(
    '/load',
    async (req, reply) => {
      try {
        const { entity_id } = req.query;

        if (!entity_id) {
          return reply.code(400).send({ message: 'Missing application ID', entity_id: '' });
        }

        const application = await getEntityById<Application>(app, 'applications', entity_id);

        return reply.code(200).send(application);
      } catch (err: any) {
        console.error('❌ Error in /load:', err);
        const status = err.message.includes('not found') ? 404 : 500;
        return reply.code(status).send({ message: err.message });
      }
    }
  );
  
  // create and apply for application
  app.post<{ Body: CreateApplicationRequest; Reply: EntityUpdateStatusResponse }>(
    '/create',
    async (req, reply) => {
      try {
        const { user_id, event_id, answers } = req.body;

        if (!user_id || !event_id || !answers || typeof answers !== 'object') {
          return reply.code(400).send({ message: 'Invalid input', entity_id: '' });
        }

        const application = await createApplication(app, user_id, event_id, answers);
        await app.db.collection('applications').doc(application.application_id).set(application);
        console.log(`✅ Created application ${application.application_id}`);

        await linkApplicationToEvent(app, event_id, application.application_id);
        console.log(`📌 Linked to event ${event_id}`);

        await linkApplicationToUser(app, user_id, application.application_id);
        console.log(`👤 Linked to user ${user_id}`);

        return reply.code(201).send({
          message: 'Application submitted',
          entity_id: application.application_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: err.message, entity_id: '' });
      }
    }
  );

  // update application status
  app.post<{ Body: UpdateApplicationStatusRequest; Reply: EntityUpdateStatusResponse }>(
    '/update',
    async (req, reply) => {
      try {
        const { application_id, updated_application_status } = req.body;

        if (!application_id || !updated_application_status) {
          return reply.code(400).send({ message: 'Invalid input', entity_id: '' });
        }

        const application = await updateApplicationStatus(app, application_id, updated_application_status);
        console.log(`✅ Changed application status to ${application_id} to ${updated_application_status}`);;

        return reply.code(201).send({
          message: `Application status changed to ${updated_application_status}`,
          entity_id: application_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: err.message, entity_id: '' });
      }
    }
  );

  // update application status
  app.post<{ Body: UpdateApplicationStatusRequest; Reply: EntityUpdateStatusResponse }>(
    '/delete',
    async (req, reply) => {
      try {
        const { application_id, updated_application_status } = req.body;

        if (!application_id || !updated_application_status) {
          return reply.code(400).send({ message: 'Invalid input', entity_id: '' });
        }

        const application = await updateApplicationStatus(app, application_id, updated_application_status);
        console.log(`✅ Changed application status to ${application_id} to ${updated_application_status}`);;

        return reply.code(201).send({
          message: `Application status changed to ${updated_application_status}`,
          entity_id: application_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: err.message, entity_id: '' });
      }
    }
  );
};

export default applications;
