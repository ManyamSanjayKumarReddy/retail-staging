import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link2, FileText, X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ExternalLink {
  title: string;
  url: string;
}

interface Attachment {
  name: string;
  url: string;
}

interface LinksAttachmentsEditorProps {
  links: ExternalLink[];
  attachments: Attachment[];
  onLinksChange: (links: ExternalLink[]) => void;
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxLinks?: number;
  maxAttachments?: number;
}

export const LinksAttachmentsEditor: React.FC<LinksAttachmentsEditorProps> = ({
  links,
  attachments,
  onLinksChange,
  onAttachmentsChange,
  maxLinks = 3,
  maxAttachments = 3,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);

  // Links management
  const addLink = () => {
    if (links.length >= maxLinks) return;
    onLinksChange([...links, { title: '', url: '' }]);
  };

  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    onLinksChange(updated);
  };

  const removeLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  // Attachments management
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length >= maxAttachments) {
      toast({ title: `Maximum ${maxAttachments} attachments allowed`, variant: 'destructive' });
      return;
    }

    const file = files[0];
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast({ title: 'Only PDF and DOC files are allowed', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      
      onAttachmentsChange([...attachments, { name: file.name, url: data.publicUrl }]);
      toast({ title: 'File uploaded!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 p-4 rounded-lg border bg-muted/30">
      {/* External Links Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold">External Links</Label>
            <span className="text-xs text-muted-foreground">({links.length}/{maxLinks})</span>
          </div>
          {links.length < maxLinks && (
            <Button type="button" variant="outline" size="sm" onClick={addLink}>
              <Plus className="w-3 h-3 mr-1" /> Add Link
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Add YouTube, Instagram, or other external links</p>
        
        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Title (e.g., YouTube Demo)"
                  value={link.title}
                  onChange={(e) => updateLink(index, 'title', e.target.value)}
                  className="w-1/3"
                />
                <Input
                  placeholder="URL (e.g., https://youtube.com/...)"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeLink(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No links added</p>
        )}
      </div>

      {/* Attachments Section */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold">Attachments</Label>
            <span className="text-xs text-muted-foreground">({attachments.length}/{maxAttachments})</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Upload PDF or DOC files (specifications, instructions, etc.)</p>
        
        {attachments.length < maxAttachments && (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs"
            />
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
        )}

        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate flex-1">{attachment.name}</span>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View
                </a>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No attachments added</p>
        )}
      </div>
    </div>
  );
};

export default LinksAttachmentsEditor;
