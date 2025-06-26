import { FastifyPluginAsync } from 'fastify';
import { CreateEventRequest } from '../types/requests/createEventRequest';
import { EntityUpdateStatusResponse } from '../types/responses/entityUpdateStatusResponse';
import { LoadEntityRequest}  from '../types/requests/loadEntityRequest';
import { createEvent } from '../services/eventService';
import { getEntityById} from '../services/entityService';


const events: FastifyPluginAsync = async (app) => {
  // load event
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

  // create an event
  app.post<{ Body: CreateEventRequest; Reply: EntityUpdateStatusResponse }>(
    '/create',
    async (req, reply) => {
      try {
        const { user_id, image_url, start_date, end_date, description, volunteer_form, category, org_title, country, region, city } = req.body;
        console.log('🧪 Incoming event payload:', req.body);
        
        if (!user_id || !image_url || !start_date || !end_date || !description || !volunteer_form || !category || !org_title || !country || !region || !city) {
          return reply.code(400).send({ message: 'Invalid input for event', entity_id: '' });
        }

        const event = await createEvent(app, user_id, image_url, start_date, end_date, description, volunteer_form, category, org_title, country, region, city );
        
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
};

export default events;
