import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Type, Calendar } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Switch } from '@/components/ui/switch';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: '',
    currency_symbol: '₹',
    whatsapp_number: '',
    whatsapp_message: '',
    footer_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    items_page_cta_text: 'Order on WhatsApp',
    rentals_page_cta_text: 'Rent on WhatsApp',
    item_detail_cta_text: 'Order on WhatsApp',
    rental_detail_cta_text: 'Request Rental on WhatsApp',
    contact_submit_text: 'Submit Request',
    rental_allow_past_dates: false,
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
          site_name: data.site_name || '',
          currency_symbol: data.currency_symbol || '₹',
          whatsapp_number: data.whatsapp_number || '',
          whatsapp_message: data.whatsapp_message || '',
          footer_description: data.footer_description || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_address: data.contact_address || '',
          items_page_cta_text: data.items_page_cta_text || 'Order on WhatsApp',
          rentals_page_cta_text: data.rentals_page_cta_text || 'Rent on WhatsApp',
          item_detail_cta_text: data.item_detail_cta_text || 'Order on WhatsApp',
          rental_detail_cta_text: data.rental_detail_cta_text || 'Request Rental on WhatsApp',
          contact_submit_text: data.contact_submit_text || 'Submit Request',
          rental_allow_past_dates: data.rental_allow_past_dates || false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
      toast({ title: 'Settings saved!', description: 'Your changes have been applied.' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your store settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic store information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Store Name</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => setSettings(p => ({ ...p, site_name: e.target.value }))}
                placeholder="My Store"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency_symbol">Currency Symbol</Label>
              <Input
                id="currency_symbol"
                value={settings.currency_symbol}
                onChange={(e) => setSettings(p => ({ ...p, currency_symbol: e.target.value }))}
                placeholder="₹, $, €, £"
              />
              <p className="text-sm text-muted-foreground">Examples: ₹, $, €, £, ¥</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer_description">Footer Description</Label>
            <Textarea
              id="footer_description"
              value={settings.footer_description}
              onChange={(e) => setSettings(p => ({ ...p, footer_description: e.target.value }))}
              placeholder="A short description about your store..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WhatsAppIcon className="w-5 h-5 text-whatsapp" />
            WhatsApp Settings
          </CardTitle>
          <CardDescription>Configure your WhatsApp contact button</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <Input
              id="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings(p => ({ ...p, whatsapp_number: e.target.value }))}
              placeholder="919876543210 (with country code, no +)"
            />
            <p className="text-sm text-muted-foreground">Enter without + symbol. E.g., 919876543210</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_message">Default Message</Label>
            <Textarea
              id="whatsapp_message"
              value={settings.whatsapp_message}
              onChange={(e) => setSettings(p => ({ ...p, whatsapp_message: e.target.value }))}
              placeholder="Hi! I'm interested in your products..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Displayed on the contact page and footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings(p => ({ ...p, contact_email: e.target.value }))}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={settings.contact_phone}
                onChange={(e) => setSettings(p => ({ ...p, contact_phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_address">Address</Label>
            <Textarea
              id="contact_address"
              value={settings.contact_address}
              onChange={(e) => setSettings(p => ({ ...p, contact_address: e.target.value }))}
              placeholder="Your store address..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Button Text Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Button Text Settings
          </CardTitle>
          <CardDescription>Customize button labels across your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="items_page_cta_text">Items Page CTA</Label>
              <Input
                id="items_page_cta_text"
                value={settings.items_page_cta_text}
                onChange={(e) => setSettings(p => ({ ...p, items_page_cta_text: e.target.value }))}
                placeholder="Order on WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentals_page_cta_text">Rentals Page CTA</Label>
              <Input
                id="rentals_page_cta_text"
                value={settings.rentals_page_cta_text}
                onChange={(e) => setSettings(p => ({ ...p, rentals_page_cta_text: e.target.value }))}
                placeholder="Rent on WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item_detail_cta_text">Item Detail CTA</Label>
              <Input
                id="item_detail_cta_text"
                value={settings.item_detail_cta_text}
                onChange={(e) => setSettings(p => ({ ...p, item_detail_cta_text: e.target.value }))}
                placeholder="Order on WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rental_detail_cta_text">Rental Detail CTA</Label>
              <Input
                id="rental_detail_cta_text"
                value={settings.rental_detail_cta_text}
                onChange={(e) => setSettings(p => ({ ...p, rental_detail_cta_text: e.target.value }))}
                placeholder="Request Rental on WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_submit_text">Contact Form Submit Button</Label>
              <Input
                id="contact_submit_text"
                value={settings.contact_submit_text}
                onChange={(e) => setSettings(p => ({ ...p, contact_submit_text: e.target.value }))}
                placeholder="Submit Request"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Rental Settings
          </CardTitle>
          <CardDescription>Configure rental-specific options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div>
              <p className="font-semibold">Allow Past Dates for Rentals</p>
              <p className="text-sm text-muted-foreground">Enable customers to select dates before today</p>
            </div>
            <Switch
              checked={settings.rental_allow_past_dates}
              onCheckedChange={(c) => setSettings(p => ({ ...p, rental_allow_past_dates: c }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
