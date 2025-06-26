import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { Event } from '../types/models/event';
import { Application } from '../types/models/application';
import { db } from '../plugins/firebase';

// ───────────────────────────────────────────────────────────────────────────────
//  Constants & helpers
// ───────────────────────────────────────────────────────────────────────────────
const DEFAULT_IMG =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxIe3REDtuoeOD94WVaTfoKr1UumNxRoGakw&s';

const VOLUNTEER_Q_BANK = [
  'Why do you want to volunteer for this event?',
  'What relevant experience or skills do you have?',
  'How many hours per week can you commit?',
  'Do you have any physical limitations we should know about?',
  'Are you comfortable working in a team setting?',
  'Have you volunteered before? If so, where?',
  'What motivates you to help in this cause?',
  'Which days and times are you generally available?',
  'How did you hear about this opportunity?',
  'Do you require any special accommodations?',
];

export const VOLUNTEER_Q_ANSWERS: Record<string, string[]> = {
  'Why do you want to volunteer for this event?': [
    'I want to give back to the community.',
    'I’m passionate about the cause this event supports.',
    'I’m looking to gain experience in volunteering.',
    'I believe in making a positive impact where I can.',
    'Volunteering gives me a sense of purpose and fulfillment.',
  ],
  'What relevant experience or skills do you have?': [
    'I have organized community cleanups before.',
    'I have strong communication and teamwork skills.',
    'I have experience managing logistics for events.',
    'I’ve volunteered at food banks and shelters.',
    'I’m trained in first aid and crowd management.',
  ],
  'How many hours per week can you commit?': [
    'I can volunteer up to 10 hours weekly.',
    'Around 5 hours during weekends.',
    'Approximately 3–4 hours on weekdays.',
    'I’m available for 2 hours every evening.',
    'Up to 15 hours depending on the week.',
  ],
  'Do you have any physical limitations we should know about?': [
    'No, I’m fully capable of all physical tasks.',
    'I have mild back pain and prefer light duties.',
    'I can’t lift heavy objects but can assist in other ways.',
    'I use a wheelchair and prefer accessible environments.',
    'I’m recovering from an injury and prefer seated work.',
  ],
  'Are you comfortable working in a team setting?': [
    'Yes, I thrive in team-based environments.',
    'I enjoy working with others to achieve shared goals.',
    'Yes, collaboration is one of my strengths.',
    'I’m comfortable leading or following in teams.',
    'Absolutely, I prefer team efforts over solo tasks.',
  ],
  'Have you volunteered before? If so, where?': [
    'Yes, at the local animal shelter.',
    'I volunteered with the Red Cross last year.',
    'Yes, I helped organize a neighborhood food drive.',
    'I volunteered during school fundraising events.',
    'No, this will be my first volunteering experience.',
  ],
  'What motivates you to help in this cause?': [
    'I believe in social responsibility.',
    'I was personally affected by this issue.',
    'Helping others brings me joy.',
    'This cause aligns with my values and interests.',
    'I want to be part of meaningful change.',
  ],
  'Which days and times are you generally available?': [
    'Weekends, anytime.',
    'Weekdays after 5 PM.',
    'Monday, Wednesday, and Friday mornings.',
    'Evenings throughout the week.',
    'Saturday afternoons and Sundays.',
  ],
  'How did you hear about this opportunity?': [
    'Through KaiKaci platform.',
  ],
  'Do you require any special accommodations?': [
    'No, I do not require accommodations.',
    'Yes, I need wheelchair-accessible facilities.',
    'I require breaks due to a medical condition.',
    'I need written instructions due to hearing loss.',
    'Prefer low-sensory environments.',
  ],
};

const CREATORS_BANK = [
    'creator_1',
    'creator_2',
    'creator_3',
    'creator_4',
    'creator_5',
    'creator_6',
    'creator_7',
    'creator_8',
    'creator_9',
    'creator_10',
];

function pickVolunteerQuestions(): string[] {
  return faker.helpers.shuffle(VOLUNTEER_Q_BANK).slice(0, 5);
}

function pickRandomUser(): string {
  const index = Math.floor(Math.random() * CREATORS_BANK.length);
  return CREATORS_BANK[index];
}

function random2025Date(
  min: Date = new Date('2025-01-01'),
  max: Date = new Date('2025-12-31')
): Date {
  return faker.date.between({ from: min, to: max });
}

function randomLocation() {
  const isUSA = Math.random() < 0.7;

  if (isUSA) {
    const state = faker.location.state();
    const city = faker.location.city();
    return { country: 'United States', region: state, city };
  }

  const country = faker.location.country();
  const region = faker.location.state();
  const city = faker.location.city();
  return { country, region, city };
}

function formatDateYYYYDDMM(date: Date): string {
  const yyyy = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${dd}-${mm}`;
}

async function seedUsers() {
  const ALL_USERS = [
    ...CREATORS_BANK,
    ...Array.from({ length: 100 }, (_, i) => `user_${i + 1}`),
  ];

  const userPromises = ALL_USERS.map(async (user_id) => {
    const username = user_id;
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const age = faker.number.int({ min: 18, max: 40 });
    const sex = faker.helpers.arrayElement(['Male', 'Female']);
    const email = `${username}@sample.com`;
    const password = username;

    const user = {
      user_id,
      first_name,
      last_name,
      age,
      sex,
      email,
      username,
      password,
      applications: [],
      onwed_events: [],
    };

    await db.collection('users').doc(user_id).set(user);
    console.log(`👤 Seeded user: ${user_id}`);
  });

  await Promise.all(userPromises);
}

async function seedRandomApplications(event_id: string, questions: string[]) {
  const USER_POOL = Array.from({ length: 100 }, (_, i) => `user_${i + 1}`);
  const selectedUsers = faker.helpers.arrayElements(USER_POOL, 10);

  const applicationIds: string[] = [];

  for (const user_id of selectedUsers) {
    const answers: Record<string, string> = {};
    for (const question of questions) {
      const possibleAnswers = VOLUNTEER_Q_ANSWERS[question];
      answers[question] = faker.helpers.arrayElement(possibleAnswers);
    }

    const application_id = uuidv4();

    const application: Application = {
      application_id,
      event_id,
      applicant_user_id: user_id,
      answers,
      status: 'pending', // or ApplicationStatus.Pending if enum is imported
      submitted_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add application document
    await db.collection('applications').doc(application_id).set(application);
    applicationIds.push(application_id);

    // Update user document: add application_id and event_id
    await db.collection('users').doc(user_id).update({
      applications: admin.firestore.FieldValue.arrayUnion(application_id),
    });

    console.log(`📝 Seeded application: ${application_id} for user: ${user_id}`);
  }

  // Update event document: add application ids
  await db.collection('events').doc(event_id).update({
    applications: admin.firestore.FieldValue.arrayUnion(...applicationIds),
  });

  console.log(`📌 Updated event ${event_id} with ${applicationIds.length} applications.`);
}

async function seedEventsFromFile() {
    const DEFAULT_CSV_PATH = "C:\\Users\\v-aoniani\\Downloads\\volunteer_opportunities.csv";

  const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CSV_PATH;

  if (!fs.existsSync(csvPath)) {
    console.error(`\u274C  CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of records) {
    const startDate = random2025Date();
    const endDate = random2025Date(startDate, new Date('2025-12-31'));
    const { country, region, city } = randomLocation();

    const event: Event = {
      event_id: uuidv4(),
      creator_user_id: pickRandomUser(),
      image_url: DEFAULT_IMG,
      start_date: formatDateYYYYDDMM(startDate),
      end_date: formatDateYYYYDDMM(endDate),
      description: row.summary?.trim() || '',
      volunteer_form: pickVolunteerQuestions(),
      applications: [] as string[],
      hits: Number(row.hits) || 0,
      category: row.category_desc?.trim() || row.category_id?.trim() || 'General',
      org_title: row.org_title?.trim() || 'Unknown',
      country,
      region,
      city,
    };
    await db.collection('users').doc(event.creator_user_id).update({
        events: admin.firestore.FieldValue.arrayUnion(event.event_id),
    });
    console.log(`\u2714  updated user events: ${event.creator_user_id}`);

    await db.collection('events').doc(event.event_id).set(event);
    console.log(`\u2714  Seeded event: ${event.event_id}`);

    await seedRandomApplications(event.event_id, event.volunteer_form);
  }

  console.log('\u2705  Seeding complete.');
}

// ───────────────────────────────────────────────────────────────────────────────
//  Main seeding routine
// ───────────────────────────────────────────────────────────────────────────────
async function main() {

  await seedUsers();
  await seedEventsFromFile();
  
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});