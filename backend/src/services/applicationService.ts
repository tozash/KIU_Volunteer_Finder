import { FastifyInstance } from 'fastify';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Application, ApplicationStatus } from '../types/models/application';

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

export async function linkApplicationToEvent(
  app: FastifyInstance,
  event_id: string,
  application_id: string
): Promise<void> {
  const eventRef = app.db.collection('events').doc(event_id);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) throw new Error('Event not found');

  await eventRef.update({
    applications: FieldValue.arrayUnion(application_id),
  });
}

export async function linkApplicationToUser(
  app: FastifyInstance,
  user_id: string,
  application_id: string
): Promise<void> {
  const userRef = app.db.collection('users').doc(user_id);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new Error('User not found');

  await userRef.update({
    applications: FieldValue.arrayUnion(application_id),
  });
}

export async function updateApplicationStatus(
  app: FastifyInstance,
  application_id: string,
  new_status: ApplicationStatus
): Promise<void> {
  const ref = app.db.collection('applications').doc(application_id);
  const snap = await ref.get();
  if (!snap.exists) throw new Error('Application not found');

  await ref.update({ status: new_status });
}

export async function cancelApplication(
  app: FastifyInstance,
  application_id: string,
  user_id: string,
  event_id: string
): Promise<void> {
  const batch = app.db.batch();

  // Remove from applications collection
  const appRef = app.db.collection('applications').doc(application_id);
  batch.delete(appRef);

  // Remove reference from event
  const eventRef = app.db.collection('events').doc(event_id);
  batch.update(eventRef, {
    applications: FieldValue.arrayRemove(application_id),
  });

  // Remove reference from user
  const userRef = app.db.collection('users').doc(user_id);
  batch.update(userRef, {
    applications: FieldValue.arrayRemove(application_id),
  });

  await batch.commit();
}
