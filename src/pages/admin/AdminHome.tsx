import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Save, Upload, Loader2 } from 'lucide-react';

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refetch } = useSiteSettings();
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    hero_cta_primary: 'View Items',
    hero_cta_secondary: 'Rent Items',
    hero_tagline: '✨ Quality Products & Rentals',
    hero_description: '',
    featured_title: 'Top Selling Products',
    featured_subtitle: 'Featured Collection',
    featured_description: '',
    rental_title: 'Available for Rent',
    rental_subtitle: 'Rental Services',
    rental_description: '',
    whatsapp_strip_title: 'Order Directly via Chat',
    whatsapp_strip_description: '',
    whatsapp_strip_button: 'Start Chat Now',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_image: data.hero_image || '',
          hero_cta_primary: data.hero_cta_primary || 'View Items',
          hero_cta_secondary: data.hero_cta_secondary || 'Rent Items',
          hero_tagline: data.hero_tagline || '✨ Quality Products & Rentals',
          hero_description: data.hero_description || '',
          featured_title: data.featured_title || 'Top Selling Products',
          featured_subtitle: data.featured_subtitle || 'Featured Collection',
          featured_description: data.featured_description || '',
          rental_title: data.rental_title || 'Available for Rent',
          rental_subtitle: data.rental_subtitle || 'Rental Services',
          rental_description: data.rental_description || '',
          whatsapp_strip_title: data.whatsapp_strip_title || 'Order Directly via Chat',
          whatsapp_strip_description: data.whatsapp_strip_description || '',
          whatsapp_strip_button: data.whatsapp_strip_button || 'Start Chat Now',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: 'Settings saved!',
        description: 'Home page settings have been updated.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setSettings(prev => ({ ...prev, hero_image: data.publicUrl }));
      
      toast({ title: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Home Page</h1>
          <p className="text-muted-foreground mt-1">Configure all homepage sections</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The main banner on your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero_tagline">Tagline (Badge Text)</Label>
            <Input
              id="hero_tagline"
              value={settings.hero_tagline}
              onChange={(e) => setSettings(prev => ({ ...prev, hero_tagline: e.target.value }))}
              placeholder="✨ Quality Products & Rentals"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title (First Part)</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Shop Smart"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Title (Second Part - Highlighted)</Label>
              <Input
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="Save More"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_description">Hero Description</Label>
            <Textarea
              id="hero_description"
              value={settings.hero_description}
              onChange={(e) => setSettings(prev => ({ ...prev, hero_description: e.target.value }))}
              placeholder="Browse our collection of premium products and rental items..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hero_cta_primary">Primary Button Text</Label>
              <Input
                id="hero_cta_primary"
                value={settings.hero_cta_primary}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_cta_primary: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_cta_secondary">Secondary Button Text</Label>
              <Input
                id="hero_cta_secondary"
                value={settings.hero_cta_secondary}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_cta_secondary: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hero Background Image</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs"
              />
              {settings.hero_image && (
                <img src={settings.hero_image} alt="Preview" className="w-20 h-12 object-cover rounded" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Or paste an image URL:</p>
            <Input
              value={settings.hero_image}
              onChange={(e) => setSettings(prev => ({ ...prev, hero_image: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products Section</CardTitle>
          <CardDescription>The section showcasing your top selling products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="featured_subtitle">Badge Text</Label>
            <Input
              id="featured_subtitle"
              value={settings.featured_subtitle}
              onChange={(e) => setSettings(prev => ({ ...prev, featured_subtitle: e.target.value }))}
              placeholder="Featured Collection"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featured_title">Section Title</Label>
            <Input
              id="featured_title"
              value={settings.featured_title}
              onChange={(e) => setSettings(prev => ({ ...prev, featured_title: e.target.value }))}
              placeholder="Top Selling Products"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featured_description">Section Description</Label>
            <Textarea
              id="featured_description"
              value={settings.featured_description}
              onChange={(e) => setSettings(prev => ({ ...prev, featured_description: e.target.value }))}
              placeholder="Discover our most popular items..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rental Section */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Highlights Section</CardTitle>
          <CardDescription>The section showcasing your rental items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rental_subtitle">Badge Text</Label>
            <Input
              id="rental_subtitle"
              value={settings.rental_subtitle}
              onChange={(e) => setSettings(prev => ({ ...prev, rental_subtitle: e.target.value }))}
              placeholder="Rental Services"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rental_title">Section Title</Label>
            <Input
              id="rental_title"
              value={settings.rental_title}
              onChange={(e) => setSettings(prev => ({ ...prev, rental_title: e.target.value }))}
              placeholder="Available for Rent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rental_description">Section Description</Label>
            <Textarea
              id="rental_description"
              value={settings.rental_description}
              onChange={(e) => setSettings(prev => ({ ...prev, rental_description: e.target.value }))}
              placeholder="Need equipment for a short time?..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Strip Section */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Strip Section</CardTitle>
          <CardDescription>The call-to-action banner for WhatsApp ordering</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_strip_title">Section Title</Label>
            <Input
              id="whatsapp_strip_title"
              value={settings.whatsapp_strip_title}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_strip_title: e.target.value }))}
              placeholder="Order Directly via Chat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_strip_description">Section Description</Label>
            <Textarea
              id="whatsapp_strip_description"
              value={settings.whatsapp_strip_description}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_strip_description: e.target.value }))}
              placeholder="Get instant responses and the fastest delivery..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_strip_button">Button Text</Label>
            <Input
              id="whatsapp_strip_button"
              value={settings.whatsapp_strip_button}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_strip_button: e.target.value }))}
              placeholder="Start Chat Now"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;