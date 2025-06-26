import { faker } from '@faker-js/faker';
import { db } from '../plugins/firebase';
import { User } from '../types/models/user';

async function seedRandomUsers(count: number = 5) {
  for (let i = 0; i < count; i++) {
    const user: User = {
      user_id: `user_${faker.string.uuid()}`,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 60 }),
      sex: faker.helpers.arrayElement(['Male', 'Female']),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(), // In production: hash this!
      applications: [],
    };

    await db.collection('users').doc(user.user_id).set(user);
    console.log(`✅ Created user: ${user.username} (${user.user_id})`);
  }

  console.log(`🎉 Done seeding ${count} users`);
}

seedRandomUsers(10); // You can change the number here
