import { Application } from './application';

export interface Event {
  event_id: string;
  creator_user_id: string;
  image_url: string;
  start_date: string; 
  end_date: string;
  // location: Location;
  description: string;
  volunteer_form: string[];
  applications: Application[];
}
