import { faker } from '@faker-js/faker';
import { db } from '../../plugins/firebase';
import { CREATORS_BANK } from '../utils/constants';

export async function seedUsers() {
  const ALL_USERS = [
    ...CREATORS_BANK,
    ...Array.from({ length: 100 }, (_, i) => `user_${i + 1}`),
  ];

  const userPromises = ALL_USERS.map(async (user_id) => {
    const user = {
      user_id,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 40 }),
      sex: faker.helpers.arrayElement(['Male', 'Female']),
      email: `${user_id}@sample.com`,
      username: user_id,
      password: user_id,
      applications: [],
      events: [],
    };

    await db.collection('users').doc(user_id).set(user);
    console.log(`👤 Seeded user: ${user_id}`);
  });

  await Promise.all(userPromises);
}
