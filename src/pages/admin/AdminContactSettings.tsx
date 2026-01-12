import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const AdminContactSettings = () => {
  const { settings: siteSettings, refetch } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    contact_page_title: 'Contact Us',
    contact_page_subtitle: 'Have a custom requirement? Get in touch and we\'ll make it happen.',
    contact_form_title: 'Custom Order Request',
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        contact_email: siteSettings.contact_email || '',
        contact_phone: siteSettings.contact_phone || '',
        contact_address: siteSettings.contact_address || '',
        contact_page_title: (siteSettings as any).contact_page_title || 'Contact Us',
        contact_page_subtitle: (siteSettings as any).contact_page_subtitle || 'Have a custom requirement? Get in touch and we\'ll make it happen.',
        contact_form_title: (siteSettings as any).contact_form_title || 'Custom Order Request',
      });
    }
  }, [siteSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          contact_address: formData.contact_address,
          contact_page_title: formData.contact_page_title,
          contact_page_subtitle: formData.contact_page_subtitle,
          contact_form_title: formData.contact_form_title,
          updated_at: new Date().toISOString()
        })
        .eq('id', siteSettings?.id);

      if (error) throw error;
      await refetch();
      toast({ title: 'Contact settings saved!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold text-foreground">Contact Page Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your contact page content and information</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Page Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Page Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_page_title">Page Title</Label>
            <Input
              id="contact_page_title"
              value={formData.contact_page_title}
              onChange={(e) => setFormData(p => ({ ...p, contact_page_title: e.target.value }))}
              placeholder="Contact Us"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_page_subtitle">Page Subtitle</Label>
            <Textarea
              id="contact_page_subtitle"
              value={formData.contact_page_subtitle}
              onChange={(e) => setFormData(p => ({ ...p, contact_page_subtitle: e.target.value }))}
              placeholder="Have a custom requirement? Get in touch..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_form_title">Form Title</Label>
            <Input
              id="contact_form_title"
              value={formData.contact_form_title}
              onChange={(e) => setFormData(p => ({ ...p, contact_form_title: e.target.value }))}
              placeholder="Custom Order Request"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(p => ({ ...p, contact_phone: e.target.value }))}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(p => ({ ...p, contact_email: e.target.value }))}
                placeholder="contact@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Address
            </Label>
            <Textarea
              id="contact_address"
              value={formData.contact_address}
              onChange={(e) => setFormData(p => ({ ...p, contact_address: e.target.value }))}
              placeholder="123 Retail Street, City, State, ZIP"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> WhatsApp number is configured in the main Settings page.
        </p>
      </div>
    </div>
  );
};

export default AdminContactSettings;
