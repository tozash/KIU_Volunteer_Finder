export interface UpdateEventRequest {
  event_id: string,
  title: string,
  image_url: string,
  start_date: string,
  end_date: string,
  description: string,
  volunteer_form: string[],
}
