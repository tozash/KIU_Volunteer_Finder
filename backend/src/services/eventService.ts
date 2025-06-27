import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/models/event';
import { updateCreatorEventsList } from './userService';
import { LoadEventsRequest } from '../types/requests/loadEventsRequest';
import { CreateEventRequest } from '../types/requests/createEventRequest';


export async function loadEvents(
  app: FastifyInstance,
  filters: LoadEventsRequest
): Promise<Event[]> {
  let q: FirebaseFirestore.Query = app.db.collection('events');

  // ── exact-match filters ─────────────────────────────────────────────
  if (filters.creator_id) q = q.where('creator_user_id', '==', filters.creator_id);
  /*
  if (filters.org_title)  q = q.where('org_title',       '==', filters.org_title);
  if (filters.category)   q = q.where('category',        '==', filters.category);
  if (filters.country)    q = q.where('country',         '==', filters.country);

  // ── range filters ──────────────────────────────────────────────────
  if (filters.hits_min)
                          q = q.where('hits', '>=', Number(filters.hits_min));
  if (filters.hits_max)
                          q = q.where('hits', '<=', Number(filters.hits_max));*/
                        
  // ── sort by hits descending ───────────────────────────────────────
  q = q.orderBy('hits', 'desc');

  // ── run query & map to typed objects ───────────────────────────────
  const snap = await q.get();
  return snap.docs.map(d => d.data() as Event);
}

export async function createEvent(
  app: FastifyInstance,
  createRequest: CreateEventRequest
): Promise<Event> {
  const event: Event = {
    event_id: uuidv4(),
    creator_user_id: createRequest.user_id,
    image_url: createRequest.image_url,
    start_date: createRequest.start_date,
    end_date: createRequest.end_date,
    description: createRequest.description,
    volunteer_form: createRequest.volunteer_form,
    applications: [],
    hits: 0,
    category: createRequest.category,
    org_title: createRequest.org_title,
    country: createRequest.country,
    region: createRequest.region,
    city: createRequest.city,
  };

  await app.db.collection('events').doc(event.event_id).set(event);
  await updateCreatorEventsList(app, event.creator_user_id, event.event_id);

  return event;
}