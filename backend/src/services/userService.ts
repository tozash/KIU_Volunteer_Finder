import { FastifyInstance } from 'fastify';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/models/user';
import bcrypt from 'bcrypt';

export async function createUser(
  app: FastifyInstance,
  first_name: string,
  last_name: string,
  age: number,
  sex: 'Male' | 'Female',
  email: string,
  username: string,
  password: string,
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10); 

  const user: User = {
    user_id: uuidv4(),
    first_name,
    last_name,
    age,
    sex,
    email,
    username,
    password: hashedPassword,
    applications: [],
    events: [],
  };

  await app.db.collection('users').doc(user.user_id).set(user);
  console.log(`✅ Created user='${user.user_id}'`);
  return user;
}


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

  console.log(`✅ Updated user='${creator_user_id}' events with event=${event_id}`);
}