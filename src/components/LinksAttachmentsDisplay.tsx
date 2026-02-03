import React from 'react';
import { ExternalLink, FileText, Youtube, Instagram, Link2 } from 'lucide-react';

interface ExternalLinkItem {
  title: string;
  url: string;
}

interface AttachmentItem {
  name: string;
  url: string;
}

interface LinksAttachmentsDisplayProps {
  links?: ExternalLinkItem[];
  attachments?: AttachmentItem[];
}

const getLinkIcon = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return <Youtube className="w-4 h-4 text-red-500" />;
  }
  if (lowerUrl.includes('instagram.com')) {
    return <Instagram className="w-4 h-4 text-pink-500" />;
  }
  return <Link2 className="w-4 h-4 text-primary" />;
};

export const LinksAttachmentsDisplay: React.FC<LinksAttachmentsDisplayProps> = ({
  links = [],
  attachments = [],
}) => {
  const validLinks = links.filter(l => l.url && l.url.trim() !== '');
  const validAttachments = attachments.filter(a => a.url && a.url.trim() !== '');

  if (validLinks.length === 0 && validAttachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {validLinks.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Related Links
          </h3>
          <div className="flex flex-wrap gap-2">
            {validLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-all duration-300 hover:border-primary hover:shadow-md"
              >
                {getLinkIcon(link.url)}
                <span className="text-sm font-medium text-foreground">
                  {link.title || 'View Link'}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}

      {validAttachments.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Downloads
          </h3>
          <div className="flex flex-wrap gap-2">
            {validAttachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-all duration-300 hover:border-primary hover:shadow-md"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {attachment.name || 'Download File'}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksAttachmentsDisplay;
