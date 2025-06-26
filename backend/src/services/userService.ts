import { FastifyInstance } from 'fastify';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/models/event';
import events from '../routes/eventRoutes';

export async function updateCreatorEventsList(
  app: FastifyInstance,
  creator_user_id: string,
  event_id: string,
): Promise<void> {
  const userRef = app.db.collection('users').doc(creator_user_id);

  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new Error('User not found');

  await userRef.update({
    events: FieldValue.arrayUnion(event_id),
  });

  console.log(`✅ Updatede user='${creator_user_id}' events with event=${event_id}`);
}