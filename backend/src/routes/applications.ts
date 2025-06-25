import { FastifyPluginAsync } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Application } from '../models/application';
import { CreateApplicationRequest } from '../types/requests/createApplicationRequest';
import { CreateApplicationResponse } from '../types/responses/createApplicationResponse';

const applicationsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateApplicationRequest; Reply: CreateApplicationResponse }>(
    '/apply',
    async (req, reply) => {
      try {
        const { user_id, event_id, answers } = req.body;

        if (!user_id || !event_id || !answers || typeof answers !== 'object') {
          return reply.code(400).send({ message: 'Invalid input', application_id: '' });
        }

        const application_id = uuidv4();
        const application: Application = {
          application_id,
          event_id,
          applicant_user_id: user_id,
          answers,
          status: 'pending',
          submitted_at: Timestamp.now(),
        };

        await app.db.collection('applications').doc(application_id).set(application);
        console.log(`✅ Created application ${application_id}`);

        const eventRef = app.db.collection('events').doc(event_id);
        const eventSnap = await eventRef.get();
        if (!eventSnap.exists) {
          return reply.code(404).send({ message: 'Event not found', application_id: '' });
        }

        await eventRef.update({
          applications: FieldValue.arrayUnion(application_id),
        });
        console.log(`📌 Linked application ${application_id} to event ${event_id}`);

        return reply.code(201).send({ message: 'Application submitted', application_id });
      } catch (err) {
        console.error('❌ Error in /apply:', err);
        return reply.code(500).send({ message: 'Internal server error', application_id: '' });
      }
    }
  );
};

export default applicationsRoutes;
