export type Car = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  category: string;
  created_at: string;
  is_sold: boolean;
  main_image: string;
  gallery: string[];
  description: string;
  color?: string;
  power_hp?: number;
  video_url?: string;
  extras?: string[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  car_id?: string;
  created_at: string;
  status: string;
};

export type AdminLoginResponse = {
  token: string;
  email: string;
};

