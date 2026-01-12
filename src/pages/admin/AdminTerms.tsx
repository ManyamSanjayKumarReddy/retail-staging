import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileText, Eye } from 'lucide-react';

const AdminTerms = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_conditions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setContent(data.content || '');
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
      if (existingId) {
        const { error } = await supabase
          .from('terms_conditions')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', existingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('terms_conditions')
          .insert([{ content }])
          .select()
          .single();
        if (error) throw error;
        setExistingId(data.id);
      }
      toast({ title: 'Terms & Conditions saved!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving', variant: 'destructive' });
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
          <h1 className="text-3xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="text-muted-foreground mt-1">Manage your terms and conditions content</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Content Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Terms & Conditions Content</Label>
            <p className="text-sm text-muted-foreground">
              Write your terms and conditions here. Use line breaks to separate paragraphs.
            </p>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder={`Example:

1. INTRODUCTION
Welcome to our store. By using our services, you agree to these terms.

2. ORDERS & PAYMENTS
- All orders are subject to availability
- Payment must be made before delivery
- We accept UPI, Card, and Cash on Delivery

3. RETURNS & REFUNDS
- Items can be returned within 7 days
- Refunds will be processed within 5-7 business days

4. RENTAL TERMS
- Rental period starts from the delivery date
- Late returns will incur additional charges
- Customer is responsible for any damages

5. CONTACT
For any queries, please contact us via WhatsApp or email.`}
              className="font-mono text-sm min-h-[400px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTerms;
