import { FastifyPluginAsync } from 'fastify';
import { CreateEventRequest } from '../types/requests/createEventRequest';
import { EntityUpdateStatusResponse } from '../types/responses/entityUpdateStatusResponse';
import { LoadEntityRequest}  from '../types/requests/loadEntityRequest';
import { createEvent } from '../services/eventService';
import { getEntityById} from '../services/entityService';
import { loadEvents }          from '../services/eventService';
import { LoadEventsRequest }   from '../types/requests/loadEventsRequest';
import { Event } from '../types/models/event';


const events: FastifyPluginAsync = async (app) => {
  // load event
  app.get<{ Querystring: LoadEventsRequest; Reply: Event[] }>(
    '/loadMany',
    async (req, reply) => {
      try {
        const events = await loadEvents(app, req.query);
        return reply.send(events);
      } catch (err: any) {
        console.error('❌ Error in /events/list:', err);
        return reply.code(500).send([]);
      }
    }
  );

  // create an event
  app.post<{ Body: CreateEventRequest; Reply: EntityUpdateStatusResponse }>(
    '/create',
    async (req, reply) => {
      try {
        if (!req.body.user_id 
          || !req.body.image_url 
          || !req.body.start_date 
          || !req.body.end_date 
          || !req.body.description 
          || !req.body.volunteer_form 
          || !req.body.category 
          || !req.body.org_title 
          || !req.body.country 
          || !req.body.region 
          || !req.body.city) {
          return reply.code(400).send({ message: 'Invalid input for event', entity_id: '' });
        }

        const event = await createEvent(app, req.body);
        
        console.log(`✅ Created event with id=${event.event_id}`);

        return reply.code(201).send({
          message: `Successfully created event`,
          entity_id: event.event_id,
        });
      } catch (err: any) {
        console.error('❌ Error in /apply:', err);
        const status = err.message === 'Event not found' || err.message === 'User not found' ? 404 : 500;
        return reply.code(status).send({ message: 'here', entity_id: '' });
      }
    }
  );

  // load all events
  app.get<{ Querystring: LoadEntityRequest }>(
    '/load',
    async (req, reply) => {
      try {
        const { entity_id } = req.query;

        if (!entity_id) {
          return reply.code(400).send({ message: 'Missing event ID', entity_id: '' });
        }

        const application = await getEntityById<Event>(app, 'events', entity_id);

        return reply.code(200).send(application);
      } catch (err: any) {
        console.error('❌ Error in /load:', err);
        const status = err.message.includes('not found') ? 404 : 500;
        return reply.code(status).send({ message: err.message });
      }
    }
  );
};

export default events;
