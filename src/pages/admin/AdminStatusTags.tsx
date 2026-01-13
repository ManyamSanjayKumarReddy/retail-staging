import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Tag } from 'lucide-react';
import { StatusTag } from '@/types/database';

const PRESET_COLORS = [
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Teal', value: '#14b8a6' },
];

const AdminStatusTags = () => {
  const [tags, setTags] = useState<StatusTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<StatusTag | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    color: '#f59e0b',
    is_active: true,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('status_tags')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTags(data || []);
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
      const tagData = {
        name: formData.name,
        color: formData.color,
        is_active: formData.is_active,
        sort_order: editingTag ? editingTag.sort_order : tags.length,
      };

      if (editingTag) {
        const { error } = await supabase
          .from('status_tags')
          .update(tagData)
          .eq('id', editingTag.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('status_tags').insert([tagData]);
        if (error) throw error;
      }

      toast({ title: editingTag ? 'Status tag updated!' : 'Status tag created!' });
      setDialogOpen(false);
      resetForm();
      fetchTags();
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving status tag', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this status tag?')) return;

    try {
      // First delete all product associations
      await supabase.from('product_status_tags').delete().eq('status_tag_id', id);
      
      const { error } = await supabase.from('status_tags').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Status tag deleted!' });
      fetchTags();
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error deleting status tag', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#f59e0b',
      is_active: true,
    });
    setEditingTag(null);
  };

  const openEditDialog = (tag: StatusTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      is_active: tag.is_active,
    });
    setDialogOpen(true);
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
          <h1 className="text-3xl font-bold text-foreground">Status Tags</h1>
          <p className="text-muted-foreground mt-1">Create custom status badges for items & rentals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Status Tag</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTag ? 'Edit Status Tag' : 'Add New Status Tag'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} 
                  required 
                  placeholder="e.g., Featured, Top Selling, New Arrival"
                />
              </div>

              <div className="space-y-2">
                <Label>Tag Color *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, color: color.value }))}
                      className={`h-10 rounded-lg border-2 transition-all ${formData.color === color.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Label htmlFor="custom_color" className="text-sm text-muted-foreground">Custom:</Label>
                  <Input
                    id="custom_color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="w-16 h-8 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="w-28"
                    placeholder="#f59e0b"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <span 
                    className="rounded px-2 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name || 'Tag Name'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  id="is_active" 
                  checked={formData.is_active} 
                  onCheckedChange={(c) => setFormData(p => ({ ...p, is_active: c }))} 
                />
                <Label htmlFor="is_active">Active (visible in tag selection)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Your Status Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No status tags yet. Click "Add Status Tag" to create your first tag.
            </p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    <span 
                      className="rounded px-2 py-1 text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                    {!tag.is_active && (
                      <span className="text-xs text-muted-foreground">(inactive)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(tag)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(tag.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatusTags;
