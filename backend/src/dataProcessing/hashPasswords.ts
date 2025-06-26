import bcrypt from 'bcrypt';
import { db } from '../plugins/firebase';

async function hashUserPasswords() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  if (snapshot.empty) {
    console.log('No users found.');
    return;
  }

  const saltRounds = 10;
  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const userData = doc.data();

    if (!userData.password || userData.password.startsWith('$2b$')) {
      // Skip already hashed passwords
      continue;
    }

    try {
      const hashed = await bcrypt.hash(userData.password, saltRounds);
      await doc.ref.update({ password: hashed });
      updatedCount++;
      console.log(`🔒 Updated password for user_id=${userData.user_id}`);
    } catch (err) {
      console.error(`❌ Failed to update user_id=${userData.user_id}:`, err);
    }
  }

  console.log(`Password update complete. Total users updated: ${updatedCount}`);
}

hashUserPasswords().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
