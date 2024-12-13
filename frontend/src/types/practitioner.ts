export interface Practitioner {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
  };
  specialty: string;
  location: string;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  created_at: string;
  updated_at: string | null;
} 