import { faker } from '@faker-js/faker';

export function randomLocation() {
  const isUSA = Math.random() < 0.7;
  if (isUSA) return { country: 'United States', region: faker.location.state(), city: faker.location.city() };
  return { country: faker.location.country(), region: faker.location.state(), city: faker.location.city() };
}

export function random2025Date(min = new Date('2025-01-01'), max = new Date('2025-12-31')) {
  return faker.date.between({ from: min, to: max });
}

export function formatDateYYYYDDMM(date: Date): string {
  const yyyy = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${dd}-${mm}`;
}

