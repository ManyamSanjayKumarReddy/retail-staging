import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { PaymentMethod } from '@/types/database';

const AdminPayment = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    instructions: '',
    is_active: true,
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const methodData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
        instructions: formData.instructions,
        is_active: formData.is_active,
        sort_order: methods.length + 1,
      };

      if (editingMethod) {
        const { error } = await supabase.from('payment_methods').update(methodData).eq('id', editingMethod.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('payment_methods').insert([methodData]);
        if (error) throw error;
      }

      toast({ title: editingMethod ? 'Payment method updated!' : 'Payment method created!' });
      setDialogOpen(false);
      resetForm();
      fetchMethods();
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment method?')) return;
    try {
      const { error } = await supabase.from('payment_methods').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted!' });
      fetchMethods();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', icon: '', description: '', instructions: '', is_active: true });
    setEditingMethod(null);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      icon: method.icon || '',
      description: method.description || '',
      instructions: method.instructions || '',
      is_active: method.is_active,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-muted-foreground mt-1">Configure payment options for your customers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Method</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., UPI, Credit Card" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji or URL)</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))} placeholder="💳 or https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea id="instructions" value={formData.instructions} onChange={(e) => setFormData(p => ({ ...p, instructions: e.target.value }))} rows={4} placeholder="Payment instructions for customers..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => setFormData(p => ({ ...p, is_active: c }))} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingMethod ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {methods.map((method) => (
          <Card key={method.id} className={`${!method.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              <div className="text-2xl w-10">{method.icon || '💳'}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {!method.is_active && <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>}
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(method)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(method.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {methods.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No payment methods yet. Add UPI, Card, COD, etc.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminPayment;
