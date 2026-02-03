import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { StatusTag } from '@/types/database';
import { Loader2, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkStatusTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProductIds: string[];
  onComplete: () => void;
}

export const BulkStatusTagDialog: React.FC<BulkStatusTagDialogProps> = ({
  open,
  onOpenChange,
  selectedProductIds,
  onComplete
}) => {
  const [tags, setTags] = useState<StatusTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'add' | 'replace'>('add');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTags();
      setSelectedTagIds([]);
      setMode('add');
    }
  }, [open]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('status_tags')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    } else {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      for (const productId of selectedProductIds) {
        if (mode === 'replace') {
          // Delete all existing tags for this product
          await supabase
            .from('product_status_tags')
            .delete()
            .eq('product_id', productId);
        }

        // Insert new tags (if any selected)
        if (selectedTagIds.length > 0) {
          if (mode === 'add') {
            // Get existing tags to avoid duplicates
            const { data: existing } = await supabase
              .from('product_status_tags')
              .select('status_tag_id')
              .eq('product_id', productId);
            
            const existingIds = new Set((existing || []).map(e => e.status_tag_id));
            const newTagIds = selectedTagIds.filter(id => !existingIds.has(id));
            
            if (newTagIds.length > 0) {
              const tagInserts = newTagIds.map(tagId => ({
                product_id: productId,
                status_tag_id: tagId
              }));
              await supabase.from('product_status_tags').insert(tagInserts);
            }
          } else {
            // Replace mode - insert all selected
            const tagInserts = selectedTagIds.map(tagId => ({
              product_id: productId,
              status_tag_id: tagId
            }));
            await supabase.from('product_status_tags').insert(tagInserts);
          }
        }
      }

      toast({ 
        title: `Status tags ${mode === 'add' ? 'added to' : 'updated for'} ${selectedProductIds.length} items!` 
      });
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({ title: 'Error updating status tags', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tags className="w-5 h-5" />
            Bulk Update Status Tags
          </DialogTitle>
          <DialogDescription>
            Update status tags for {selectedProductIds.length} selected item(s)
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : tags.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No status tags available. Create tags in the Status Tags section first.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Mode Selection */}
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <Label className="text-sm font-medium">Update Mode</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'add'}
                    onChange={() => setMode('add')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Add to existing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'replace'}
                    onChange={() => setMode('replace')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Replace all</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                {mode === 'add' 
                  ? 'Selected tags will be added, existing tags will be kept' 
                  : 'All existing tags will be removed and replaced with selected tags'}
              </p>
            </div>

            {/* Tag Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Tags</Label>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Switch
                      id={`bulk-tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={(checked) => handleToggle(tag.id, checked)}
                    />
                    <Label 
                      htmlFor={`bulk-tag-${tag.id}`} 
                      className="flex-1 cursor-pointer"
                    >
                      <span 
                        className="rounded px-2 py-1 text-xs font-semibold text-white shadow-sm"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={saving || tags.length === 0}
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'replace' && selectedTagIds.length === 0 
              ? 'Remove All Tags' 
              : `Update ${selectedProductIds.length} Items`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
