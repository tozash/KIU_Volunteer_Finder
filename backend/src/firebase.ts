import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

initializeApp({
  credential: cert(process.env.SERVICE_ACCOUNT_PATH as string),
});

const db = getFirestore();
export { db };
