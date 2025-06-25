import { Router, Request, Response } from 'express';
import { db } from '../firebase';  // ✅ import after init

const router = Router();

router.get('/:user_id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('users').doc(req.params.user_id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/random', async (_req: Request, res: Response) => {
  try {
    console.log('📥 /api/users/random called');

    const snapshot = await db.collection('users').get();
    console.log(`📄 Fetched ${snapshot.size} users`);

    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const randomUser = users[Math.floor(Math.random() * users.length)];
    res.json(randomUser);
  } catch (err) {
    console.error('❌ Error in /random:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
