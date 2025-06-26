import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../secrets/serviceAccountKey.json';

const app = initializeApp({
  credential: cert(serviceAccount as any),
  projectId: serviceAccount.project_id
});

export const db = getFirestore(app);
