import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Smartphone, CreditCard, Banknote, Building2, QrCode, Plus, X, Image } from 'lucide-react';

interface PaymentSettings {
  id: string;
  upi_enabled: boolean;
  card_enabled: boolean;
  cod_enabled: boolean;
  bank_enabled: boolean;
  qr_scanner_enabled: boolean;
  qr_code_image: string | null;
  qr_code_image_2: string | null;
  qr_scanner_image: string | null;
  qr_scanner_title: string;
  qr_scanner_description: string;
  upi_id: string | null;
  upi_id_2: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  how_it_works: string[];
  // Page text fields
  page_title: string;
  page_subtitle: string;
  upi_title: string;
  upi_description: string;
  card_title: string;
  card_description: string;
  cod_title: string;
  cod_description: string;
  bank_title: string;
  bank_description: string;
  scan_pay_title: string;
  scan_pay_description: string;
  bank_section_title: string;
  how_it_works_title: string;
  cta_text: string;
  cta_button_text: string;
}

const defaultSettings: PaymentSettings = {
  id: '',
  upi_enabled: true,
  card_enabled: true,
  cod_enabled: true,
  bank_enabled: true,
  qr_scanner_enabled: true,
  qr_code_image: null,
  qr_code_image_2: null,
  qr_scanner_image: null,
  qr_scanner_title: 'QR Code Scanner',
  qr_scanner_description: 'Scan this QR code to make payment directly',
  upi_id: null,
  upi_id_2: null,
  bank_name: null,
  account_name: null,
  account_number: null,
  ifsc_code: null,
  how_it_works: [
    "After placing your order via WhatsApp, you'll receive payment details.",
    "For UPI payments, scan the QR code or use our UPI ID.",
    "For card payments, we'll send a secure payment link.",
    "Once payment is confirmed, your order will be processed immediately."
  ],
  page_title: 'Payment Information',
  page_subtitle: 'We offer multiple secure payment options for your convenience.',
  upi_title: 'UPI Payment',
  upi_description: 'Pay via any UPI app like Google Pay, PhonePe, or Paytm',
  card_title: 'Card Payment',
  card_description: 'Credit/Debit cards accepted via secure payment link',
  cod_title: 'Cash on Delivery',
  cod_description: 'Pay in cash when your order is delivered',
  bank_title: 'Bank Transfer',
  bank_description: 'Direct bank transfer to our account',
  scan_pay_title: 'Scan & Pay',
  scan_pay_description: 'Scan the QR code or use our UPI ID to make payment:',
  bank_section_title: 'Bank Transfer Details',
  how_it_works_title: 'How It Works',
  cta_text: 'Ready to complete your payment? Contact us on WhatsApp.',
  cta_button_text: 'Confirm Payment on WhatsApp'
};

const AdminPaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
          how_it_works: data.how_it_works || defaultSettings.how_it_works
        });
        setExistingId(data.id);
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
      const saveData = {
        upi_enabled: settings.upi_enabled,
        card_enabled: settings.card_enabled,
        cod_enabled: settings.cod_enabled,
        bank_enabled: settings.bank_enabled,
        qr_scanner_enabled: settings.qr_scanner_enabled,
        qr_code_image: settings.qr_code_image,
        qr_code_image_2: settings.qr_code_image_2,
        qr_scanner_image: settings.qr_scanner_image,
        qr_scanner_title: settings.qr_scanner_title,
        qr_scanner_description: settings.qr_scanner_description,
        upi_id: settings.upi_id,
        upi_id_2: settings.upi_id_2,
        bank_name: settings.bank_name,
        account_name: settings.account_name,
        account_number: settings.account_number,
        ifsc_code: settings.ifsc_code,
        how_it_works: settings.how_it_works,
        page_title: settings.page_title,
        page_subtitle: settings.page_subtitle,
        upi_title: settings.upi_title,
        upi_description: settings.upi_description,
        card_title: settings.card_title,
        card_description: settings.card_description,
        cod_title: settings.cod_title,
        cod_description: settings.cod_description,
        bank_title: settings.bank_title,
        bank_description: settings.bank_description,
        scan_pay_title: settings.scan_pay_title,
        scan_pay_description: settings.scan_pay_description,
        bank_section_title: settings.bank_section_title,
        how_it_works_title: settings.how_it_works_title,
        cta_text: settings.cta_text,
        cta_button_text: settings.cta_button_text,
        updated_at: new Date().toISOString()
      };

      if (existingId) {
        const { error } = await supabase
          .from('payment_settings')
          .update(saveData)
          .eq('id', existingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('payment_settings')
          .insert([saveData])
          .select()
          .single();
        if (error) throw error;
        setExistingId(data.id);
      }

      toast({ title: 'Payment settings saved!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'qr_code_image' | 'qr_code_image_2' | 'qr_scanner_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQR(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qr-code-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setSettings(prev => ({ ...prev, [field]: data.publicUrl }));
      toast({ title: 'QR code uploaded!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploadingQR(false);
    }
  };

  const addHowItWorksStep = () => {
    setSettings(prev => ({
      ...prev,
      how_it_works: [...prev.how_it_works, '']
    }));
  };

  const updateHowItWorksStep = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      how_it_works: prev.how_it_works.map((step, i) => i === index ? value : step)
    }));
  };

  const removeHowItWorksStep = (index: number) => {
    setSettings(prev => ({
      ...prev,
      how_it_works: prev.how_it_works.filter((_, i) => i !== index)
    }));
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
          <h1 className="text-3xl font-bold text-foreground">Payment Settings</h1>
          <p className="text-muted-foreground mt-1">Configure payment methods and details</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Payment Method Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
              <Switch
                checked={settings.upi_enabled}
                onCheckedChange={(c) => setSettings(p => ({ ...p, upi_enabled: c }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Card Payment</p>
                  <p className="text-sm text-muted-foreground">Credit/Debit cards</p>
                </div>
              </div>
              <Switch
                checked={settings.card_enabled}
                onCheckedChange={(c) => setSettings(p => ({ ...p, card_enabled: c }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Banknote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when delivered</p>
                </div>
              </div>
              <Switch
                checked={settings.cod_enabled}
                onCheckedChange={(c) => setSettings(p => ({ ...p, cod_enabled: c }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                </div>
              </div>
              <Switch
                checked={settings.bank_enabled}
                onCheckedChange={(c) => setSettings(p => ({ ...p, bank_enabled: c }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
                  <QrCode className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">QR Code Scanner</p>
                  <p className="text-sm text-muted-foreground">Separate QR for direct payment</p>
                </div>
              </div>
              <Switch
                checked={settings.qr_scanner_enabled}
                onCheckedChange={(c) => setSettings(p => ({ ...p, qr_scanner_enabled: c }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Scanner Section (Separate from UPI) */}
      {settings.qr_scanner_enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-teal-600" />
              QR Code Scanner (Payment)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>QR Code Image</Label>
                {settings.qr_scanner_image ? (
                  <div className="relative w-48 h-48 mx-auto border rounded-lg overflow-hidden bg-white p-2">
                    <img src={settings.qr_scanner_image} alt="QR Scanner" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setSettings(p => ({ ...p, qr_scanner_image: null }))}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    <Image className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Upload QR code for scanner</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQRUpload(e, 'qr_scanner_image')}
                      disabled={uploadingQR}
                      className="max-w-[200px]"
                    />
                    {uploadingQR && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qr_scanner_title">Section Title</Label>
                  <Input
                    id="qr_scanner_title"
                    value={settings.qr_scanner_title}
                    onChange={(e) => setSettings(p => ({ ...p, qr_scanner_title: e.target.value }))}
                    placeholder="QR Code Scanner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr_scanner_description">Description</Label>
                  <Input
                    id="qr_scanner_description"
                    value={settings.qr_scanner_description}
                    onChange={(e) => setSettings(p => ({ ...p, qr_scanner_description: e.target.value }))}
                    placeholder="Scan this QR code to make payment"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This QR code will be displayed as a separate payment option, distinct from UPI QR codes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code & UPI Details */}
      {settings.upi_enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              UPI / QR Code Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Primary QR Code</Label>
                {settings.qr_code_image ? (
                  <div className="relative w-48 h-48 mx-auto border rounded-lg overflow-hidden bg-white p-2">
                    <img src={settings.qr_code_image} alt="QR Code" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setSettings(p => ({ ...p, qr_code_image: null }))}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    <Image className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Upload primary QR code</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQRUpload(e, 'qr_code_image')}
                      disabled={uploadingQR}
                      className="max-w-[200px]"
                    />
                    {uploadingQR && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="upi_id">Primary UPI ID</Label>
                <Input
                  id="upi_id"
                  value={settings.upi_id || ''}
                  onChange={(e) => setSettings(p => ({ ...p, upi_id: e.target.value }))}
                  placeholder="yourname@upi"
                />
                <p className="text-xs text-muted-foreground">Customers can copy this to pay directly</p>
              </div>
            </div>

            {/* Secondary QR Code */}
            <div className="border-t pt-6">
              <p className="text-sm font-medium mb-4 text-muted-foreground">Secondary UPI Option (Optional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Secondary QR Code</Label>
                  {settings.qr_code_image_2 ? (
                    <div className="relative w-48 h-48 mx-auto border rounded-lg overflow-hidden bg-white p-2">
                      <img src={settings.qr_code_image_2} alt="QR Code 2" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setSettings(p => ({ ...p, qr_code_image_2: null }))}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                      <Image className="w-10 h-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">Upload secondary QR code</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQRUpload(e, 'qr_code_image_2')}
                        disabled={uploadingQR}
                        className="max-w-[200px]"
                      />
                      {uploadingQR && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="upi_id_2">Secondary UPI ID</Label>
                  <Input
                    id="upi_id_2"
                    value={settings.upi_id_2 || ''}
                    onChange={(e) => setSettings(p => ({ ...p, upi_id_2: e.target.value }))}
                    placeholder="another@upi"
                  />
                  <p className="text-xs text-muted-foreground">Alternative UPI option for customers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Details */}
      {settings.bank_enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bank Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  value={settings.bank_name || ''}
                  onChange={(e) => setSettings(p => ({ ...p, bank_name: e.target.value }))}
                  placeholder="e.g., State Bank of India"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_name">Account Holder Name</Label>
                <Input
                  id="account_name"
                  value={settings.account_name || ''}
                  onChange={(e) => setSettings(p => ({ ...p, account_name: e.target.value }))}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={settings.account_number || ''}
                  onChange={(e) => setSettings(p => ({ ...p, account_number: e.target.value }))}
                  placeholder="e.g., 1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc_code">IFSC Code</Label>
                <Input
                  id="ifsc_code"
                  value={settings.ifsc_code || ''}
                  onChange={(e) => setSettings(p => ({ ...p, ifsc_code: e.target.value }))}
                  placeholder="e.g., SBIN0001234"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Text Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Page Text Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page_title">Page Title</Label>
              <Input
                id="page_title"
                value={settings.page_title}
                onChange={(e) => setSettings(p => ({ ...p, page_title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page_subtitle">Page Subtitle</Label>
              <Input
                id="page_subtitle"
                value={settings.page_subtitle}
                onChange={(e) => setSettings(p => ({ ...p, page_subtitle: e.target.value }))}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-4">Payment Method Labels</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upi_title">UPI Title</Label>
                <Input
                  id="upi_title"
                  value={settings.upi_title}
                  onChange={(e) => setSettings(p => ({ ...p, upi_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upi_description">UPI Description</Label>
                <Input
                  id="upi_description"
                  value={settings.upi_description}
                  onChange={(e) => setSettings(p => ({ ...p, upi_description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card_title">Card Title</Label>
                <Input
                  id="card_title"
                  value={settings.card_title}
                  onChange={(e) => setSettings(p => ({ ...p, card_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card_description">Card Description</Label>
                <Input
                  id="card_description"
                  value={settings.card_description}
                  onChange={(e) => setSettings(p => ({ ...p, card_description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cod_title">COD Title</Label>
                <Input
                  id="cod_title"
                  value={settings.cod_title}
                  onChange={(e) => setSettings(p => ({ ...p, cod_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cod_description">COD Description</Label>
                <Input
                  id="cod_description"
                  value={settings.cod_description}
                  onChange={(e) => setSettings(p => ({ ...p, cod_description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_title">Bank Title</Label>
                <Input
                  id="bank_title"
                  value={settings.bank_title}
                  onChange={(e) => setSettings(p => ({ ...p, bank_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_description">Bank Description</Label>
                <Input
                  id="bank_description"
                  value={settings.bank_description}
                  onChange={(e) => setSettings(p => ({ ...p, bank_description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-4">Section Titles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scan_pay_title">Scan & Pay Title</Label>
                <Input
                  id="scan_pay_title"
                  value={settings.scan_pay_title}
                  onChange={(e) => setSettings(p => ({ ...p, scan_pay_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scan_pay_description">Scan & Pay Description</Label>
                <Input
                  id="scan_pay_description"
                  value={settings.scan_pay_description}
                  onChange={(e) => setSettings(p => ({ ...p, scan_pay_description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_section_title">Bank Section Title</Label>
                <Input
                  id="bank_section_title"
                  value={settings.bank_section_title}
                  onChange={(e) => setSettings(p => ({ ...p, bank_section_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="how_it_works_title">How It Works Title</Label>
                <Input
                  id="how_it_works_title"
                  value={settings.how_it_works_title}
                  onChange={(e) => setSettings(p => ({ ...p, how_it_works_title: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-4">CTA Section</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_text">CTA Text</Label>
                <Input
                  id="cta_text"
                  value={settings.cta_text}
                  onChange={(e) => setSettings(p => ({ ...p, cta_text: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_button_text">CTA Button Text</Label>
                <Input
                  id="cta_button_text"
                  value={settings.cta_button_text}
                  onChange={(e) => setSettings(p => ({ ...p, cta_button_text: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>How It Works Steps</span>
            <Button variant="outline" size="sm" onClick={addHowItWorksStep}>
              <Plus className="w-4 h-4 mr-1" /> Add Step
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.how_it_works.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mt-2">
                {index + 1}
              </span>
              <Input
                value={step}
                onChange={(e) => updateHowItWorksStep(index, e.target.value)}
                placeholder={`Step ${index + 1} description...`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHowItWorksStep(index)}
                className="text-destructive shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {settings.how_it_works.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No steps added. Click "Add Step" to add instructions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentSettings;
