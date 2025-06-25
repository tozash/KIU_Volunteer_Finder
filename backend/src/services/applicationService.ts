import { Application } from '../models/application';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { FastifyInstance } from 'fastify';

export async function createApplication(
  app: FastifyInstance,
  user_id: string,
  event_id: string,
  answers: Record<string, string>
): Promise<Application> {
  const application: Application = {
    application_id: uuidv4(),
    event_id,
    applicant_user_id: user_id,
    answers,
    status: 'pending',
    submitted_at: Timestamp.now(),
  };

  await app.db.collection('applications').doc(application.application_id).set(application);
  return application;
}

export async function linkApplicationToEvent(app: FastifyInstance, event_id: string, application_id: string) {
  const eventRef = app.db.collection('events').doc(event_id);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) throw new Error('Event not found');

  await eventRef.update({
    applications: FieldValue.arrayUnion(application_id),
  });
}

export async function linkApplicationToUser(app: FastifyInstance, user_id: string, application_id: string) {
  const userRef = app.db.collection('users').doc(user_id);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new Error('User not found');

  await userRef.update({
    applications: FieldValue.arrayUnion(application_id),
  });
}
