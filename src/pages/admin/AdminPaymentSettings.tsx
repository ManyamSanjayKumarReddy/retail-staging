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
  qr_code_image: string | null;
  upi_id: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  how_it_works: string[];
}

const defaultSettings: PaymentSettings = {
  id: '',
  upi_enabled: true,
  card_enabled: true,
  cod_enabled: true,
  bank_enabled: true,
  qr_code_image: null,
  upi_id: null,
  bank_name: null,
  account_name: null,
  account_number: null,
  ifsc_code: null,
  how_it_works: [
    "After placing your order via WhatsApp, you'll receive payment details.",
    "For UPI payments, scan the QR code or use our UPI ID.",
    "For card payments, we'll send a secure payment link.",
    "Once payment is confirmed, your order will be processed immediately."
  ]
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
        qr_code_image: settings.qr_code_image,
        upi_id: settings.upi_id,
        bank_name: settings.bank_name,
        account_name: settings.account_name,
        account_number: settings.account_number,
        ifsc_code: settings.ifsc_code,
        how_it_works: settings.how_it_works,
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

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQR(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qr-code-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setSettings(prev => ({ ...prev, qr_code_image: data.publicUrl }));
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
          </div>
        </CardContent>
      </Card>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Upload */}
              <div className="space-y-3">
                <Label>Payment QR Code</Label>
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
                    <p className="text-sm text-muted-foreground mb-3">Upload your payment QR code</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleQRUpload}
                      disabled={uploadingQR}
                      className="max-w-[200px]"
                    />
                    {uploadingQR && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                  </div>
                )}
              </div>

              {/* UPI ID */}
              <div className="space-y-3">
                <Label htmlFor="upi_id">UPI ID</Label>
                <Input
                  id="upi_id"
                  value={settings.upi_id || ''}
                  onChange={(e) => setSettings(p => ({ ...p, upi_id: e.target.value }))}
                  placeholder="yourname@upi"
                />
                <p className="text-xs text-muted-foreground">Customers can copy this to pay directly</p>
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

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>How It Works</span>
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
