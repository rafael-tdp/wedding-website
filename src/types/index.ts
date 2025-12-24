export interface Guest {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  attending: boolean;
  plus_one: boolean;
  dietary_restrictions?: string;
  message?: string;
  created_at: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploaded_by?: string;
  created_at: string;
}
