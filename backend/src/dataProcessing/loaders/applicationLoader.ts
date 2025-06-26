import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { db } from '../../plugins/firebase';
import { VOLUNTEER_Q_ANSWERS } from '../utils/constants';
import { Application } from '../../types/models/application';

export async function seedRandomApplications(event_id: string, questions: string[]) {
  const USER_POOL = Array.from({ length: 100 }, (_, i) => `user_${i + 1}`);
  const selectedUsers = faker.helpers.arrayElements(USER_POOL, 10);

  const applicationIds: string[] = [];

  for (const user_id of selectedUsers) {
    const answers: Record<string, string> = {};
    for (const question of questions) {
      const possibleAnswers = VOLUNTEER_Q_ANSWERS[question];
      answers[question] = faker.helpers.arrayElement(possibleAnswers);
    }

    const application_id = uuidv4();

    const application: Application = {
      application_id,
      event_id,
      applicant_user_id: user_id,
      answers,
      status: 'pending',
      submitted_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('applications').doc(application_id).set(application);
    applicationIds.push(application_id);

    // Update user: add application_id and event_id
    await db.collection('users').doc(user_id).update({
      applications: admin.firestore.FieldValue.arrayUnion(application_id),
    });

    console.log(`📝 Seeded application: ${application_id} for user: ${user_id}`);
  }

  // Update event: add application ids
  await db.collection('events').doc(event_id).update({
    applications: admin.firestore.FieldValue.arrayUnion(...applicationIds),
  });

  console.log(`📌 Updated event ${event_id} with ${applicationIds.length} applications.`);
}
