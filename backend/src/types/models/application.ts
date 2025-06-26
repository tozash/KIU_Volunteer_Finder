export type ApplicationStatus = 'pending' | 'accepted' | 'denied' | 'cancelled';

export interface Application {
  application_id: string;
  event_id: string;              // FK to event
  applicant_user_id: string;     // FK to user
  answers: Record<string, string>; // question → answer
  status: ApplicationStatus;
  submitted_at: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
}
