import { FastifyInstance } from 'fastify';

export async function getEntityById<T = FirebaseFirestore.DocumentData>(
  app: FastifyInstance,
  collectionName: string,
  entity_id: string
): Promise<T> {
  const docRef = app.db.collection(collectionName).doc(entity_id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error(`${collectionName.slice(0, -1)} not found`); 
  }

  return docSnap.data() as T;
}
