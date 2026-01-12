import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

const defaultSettings: SiteSettings = {
  id: '',
  site_name: 'ShopSmart',
  currency_symbol: '₹',
  whatsapp_number: '',
  whatsapp_message: "Hello! I'm interested in your products.",
  hero_title: 'Shop Smart',
  hero_subtitle: 'Save More',
  hero_image: '',
  hero_cta_primary: 'View Items',
  hero_cta_secondary: 'Rent Items',
  hero_tagline: '✨ Quality Products & Rentals',
  hero_description: 'Browse our collection of premium products and rental items. Order directly via WhatsApp for the fastest service.',
  featured_title: 'Top Selling Products',
  featured_subtitle: 'Featured Collection',
  featured_description: 'Discover our most popular items. Premium quality products at unbeatable prices. Order now for same-day delivery.',
  rental_title: 'Available for Rent',
  rental_subtitle: 'Rental Services',
  rental_description: 'Need equipment for a short time? Rent premium items at affordable daily rates. Perfect for events, projects, and more.',
  whatsapp_strip_title: 'Order Directly via Chat',
  whatsapp_strip_description: 'Get instant responses and the fastest delivery. Just one tap away!',
  whatsapp_strip_button: 'Start Chat Now',
  footer_description: 'Your one-stop shop for quality products and rentals.',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  created_at: '',
  updated_at: '',
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
