export interface SignupRequest {
  first_name: string;
  last_name: string;
  age: number;
  sex: 'Male' | 'Female';
  email: string;
  username: string;
  password: string;
}