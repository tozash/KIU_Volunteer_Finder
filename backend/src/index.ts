import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

initializeApp({
  credential: cert(process.env.SERVICE_ACCOUNT_PATH as string),
});

const db = getFirestore();
const app = express();
app.use(express.json());

// sample route
app.get('/api/ping', (_, res) => res.json({ status: 'ok' }));

// Firestore example
app.post('/api/volunteers', async (req, res) => {
  const docRef = await db.collection('volunteers').add(req.body);
  res.status(201).json({ id: docRef.id });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
