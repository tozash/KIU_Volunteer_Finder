import { Timestamp } from 'firebase-admin/firestore';

export const mockEvent = {
  event_id: 'event_123',
  user_id: 'id_1', // Links to mockUser.user_id
  image_url: 'https://example.com/image.png',
  start_date: Timestamp.fromDate(new Date('2025-08-01')),
  end_date: Timestamp.fromDate(new Date('2025-08-05')),
  description: 'Volunteer cleanup event for the city park',
  volunteer_form: [
    "Why do you want to volunteer?",
    "Do you have previous experience?"
  ],
  category: 'Community',
  org_title: 'GreenForce NGO',
  country: 'Georgia',
  region: 'Tbilisi',
  city: 'Tbilisi',
  applications: ['application_1']
};

export const mockUser = {
  user_id: 'user_1',
  first_name: 'John',
  last_name: 'Doe',
  age: 28,
  sex: 'Male',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'pass123',
  applications: [],
  events: [],
};

export const mockValidSignUpRequest = {
  first_name: 'John',
  last_name: 'Doe',
  age: 28,
  sex: 'male',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'pass123'
};

export const mockInvalidSignUpRequest = {
  first_name: 'John',
  username: 'johndoe',
  password: 'pass123'
};

export const mockValidApplication = {
  application_id: 'application_1',
  event_id: 'event_123',
  applicant_user_id: 'user_456',
  answers: {
    "Why do you want to volunteer?": "To give back to the community",
    "Do you have previous experience?": "Yes, helped at a local shelter"
  },
  status: 'pending',
  submitted_at: Timestamp.fromDate(new Date()) 
};


export const mockInvalidApplication = {
  application_id: 'uid1',
  event_id: 'event_123',
};
