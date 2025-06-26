import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/models/event';
import { updateCreatorEventsList } from './userService';

export async function createEvent(
  app: FastifyInstance,
  user_id: string,
  image_url: string,
  start_date: string, 
  end_date: string,
  description: string,
  volunteer_form: string[],
  category: string,
  org_title: string,
  country: string,
  region: string,
  city: string,
): Promise<Event> {
  const event: Event = {
    event_id: uuidv4(),
    creator_user_id: user_id,
    image_url: image_url,
    start_date: start_date,
    end_date: end_date,
    description: description,
    volunteer_form: volunteer_form,
    applications: [],
    hits: 0,
    category: category,
    org_title: org_title,
    country: country,
    region: region,
    city: city,
  };

  await app.db.collection('events').doc(event.event_id).set(event);
  await updateCreatorEventsList(app, event.creator_user_id, event.event_id);

  return event;
}