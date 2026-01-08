import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Loader2 } from 'lucide-react';

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    hero_cta_primary: 'View Items',
    hero_cta_secondary: 'Rent Items',
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
          <p className="text-muted-foreground mt-1">Configure your homepage hero section</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Welcome to Our Store"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="Discover amazing products..."
                rows={2}
              />
            </div>
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
    </div>
  );
};

export default AdminHome;
