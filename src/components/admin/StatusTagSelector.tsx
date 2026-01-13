import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { StatusTag } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface StatusTagSelectorProps {
  productId?: string;
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export const StatusTagSelector: React.FC<StatusTagSelectorProps> = ({
  productId,
  selectedTagIds,
  onTagsChange,
}) => {
  const [tags, setTags] = useState<StatusTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
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
      onTagsChange([...selectedTagIds, tagId]);
    } else {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading tags...</span>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No status tags available. Create tags in the Status Tags section.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <div key={tag.id} className="flex items-center gap-2">
          <Switch
            id={`tag-${tag.id}`}
            checked={selectedTagIds.includes(tag.id)}
            onCheckedChange={(checked) => handleToggle(tag.id, checked)}
          />
          <Label 
            htmlFor={`tag-${tag.id}`} 
            className="text-sm font-medium cursor-pointer"
            style={{ color: tag.color }}
          >
            {tag.name}
          </Label>
        </div>
      ))}
    </div>
  );
};
