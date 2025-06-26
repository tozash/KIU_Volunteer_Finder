export interface LoadEventsRequest {
  creator_id?: string; 
  org_title?: string;
  category?: string;
  date_min?: string;   
  date_max?: string;    
  hits_min?: number;    
  hits_max?: number;
  country?: string;
}