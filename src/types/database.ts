export interface SiteSettings {
  id: string;
  site_name: string;
  whatsapp_number: string;
  whatsapp_message: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_tagline: string;
  hero_description: string;
  featured_title: string;
  featured_subtitle: string;
  featured_description: string;
  rental_title: string;
  rental_subtitle: string;
  rental_description: string;
  whatsapp_strip_title: string;
  whatsapp_strip_description: string;
  whatsapp_strip_button: string;
  footer_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  content?: string;
  price: number;
  original_price?: number;
  image: string;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  is_featured: boolean;
  is_rental: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  instructions: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirement: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}
