export interface CreateApplicationRequest {
  user_id: string;
  event_id: string;
  answers: Record<string, string>;
}