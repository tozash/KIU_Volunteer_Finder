import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { db } from '../../plugins/firebase';
import { formatDateYYYYDDMM, random2025Date, randomLocation } from '../utils/dataGeneratingUtils';
import { DEFAULT_IMG, CREATORS_BANK } from '../utils/constants';
import { seedRandomApplications } from './applicationLoader';
import { faker } from '@faker-js/faker';
import { VOLUNTEER_Q_ANSWERS } from '../utils/constants';

function pickRandomUser() {
  return faker.helpers.arrayElement(CREATORS_BANK);
}

function pickVolunteerQuestions(): string[] {
  return faker.helpers.shuffle(Object.keys(VOLUNTEER_Q_ANSWERS)).slice(0, 5);
}

export async function seedEventsFromFile(csvFilePath?: string) {
  const DEFAULT_PATH = "C:\\Users\\teona\\Downloads\\volunteer_opportunities.csv";
  const filePath = csvFilePath ? path.resolve(csvFilePath) : DEFAULT_PATH;

  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV file not found: ${filePath}`);
    process.exit(1);
  }

  const csvRaw = fs.readFileSync(filePath, 'utf8');
  const records = parse(csvRaw, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const startDate = random2025Date();
    const endDate = random2025Date(startDate);
    const { country, region, city } = randomLocation();

    const event_id = uuidv4();
    const creator_user_id = pickRandomUser();
    const volunteer_form = pickVolunteerQuestions();

    const event = {
      event_id,
      creator_user_id,
      image_url: DEFAULT_IMG,
      start_date: formatDateYYYYDDMM(startDate),
      end_date: formatDateYYYYDDMM(endDate),
      description: row.summary?.trim() || '',
      volunteer_form,
      applications: [],
      hits: Number(row.hits) || 0,
      category: row.category_desc?.trim() || row.category_id?.trim() || 'General',
      org_title: row.org_title?.trim() || 'Unknown',
      country,
      region,
      city,
    };

    await db.collection('events').doc(event_id).set(event);
    await db.collection('users').doc(creator_user_id).update({
      events: admin.firestore.FieldValue.arrayUnion(event_id),
    });

    console.log(`✅ Seeded event: ${event_id}`);
    await seedRandomApplications(event_id, volunteer_form);
  }

  console.log(`🎉 Event + application seeding complete.`);
}
