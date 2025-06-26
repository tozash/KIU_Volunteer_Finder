import { seedUsers } from './loaders/userLoader';
import { seedEventsFromFile } from './loaders/eventLoader';

async function main() {
  await seedUsers();
  await seedEventsFromFile();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
