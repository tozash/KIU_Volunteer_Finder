import express from 'express';
import * as dotenv from 'dotenv';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
app.use(express.json());

// Register user-related routes under /api/users
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
