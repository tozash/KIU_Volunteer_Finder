import { faker } from '@faker-js/faker';
import { db } from '../plugins/firebase';
import { Event } from '../types/models/event';

async function getRandomUserIds(): Promise<string[]> {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => (doc.data().user_id as string));
}

function generateRandomEvent(user_id: string): Event {
  const start = faker.date.future();
  const end = faker.date.soon({ days: 10, refDate: start });

  return {
    event_id: `event_${faker.string.uuid()}`,
    creator_user_id: user_id,
    image_url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
    start_date: start.toISOString(),
    end_date: end.toISOString(),
    description: faker.lorem.paragraph(),
    volunteer_form: [
      'Why do you want to volunteer?',
      'Do you have previous experience?',
      'What are your strengths?',
    ],
    applications: []
  };
}

async function seedEvents(count: number = 5) {
  const userIds = await getRandomUserIds();
  if (userIds.length === 0) {
    console.error('❌ No users found in Firestore. Seed users first.');
    return;
  }

  for (let i = 0; i < count; i++) {
    const randomUserId = faker.helpers.arrayElement(userIds);
    const event = generateRandomEvent(randomUserId);

    await db.collection('events').doc(event.event_id).set(event);
    console.log(`✅ Event created: ${event.event_id} by ${event.creator_user_id}`);
  }

  console.log(`🎉 Done seeding ${count} events`);
}

seedEvents(10); // Seed 10 events
