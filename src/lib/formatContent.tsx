import React from 'react';

/**
 * Render formatted content. Supports both HTML (from WYSIWYG editor) and legacy markdown.
 */
export const formatContent = (content: string): React.ReactNode => {
  if (!content) return null;

  // If content contains HTML tags, render as HTML
  if (/<[a-z][\s\S]*>/i.test(content) && !content.includes('**') && !content.startsWith('## ')) {
    return (
      <div 
        className="prose prose-sm max-w-none [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_hr]:my-4 [&_hr]:border-border [&_p]:my-1 [&_strong]:font-bold [&_em]:italic"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  // Legacy markdown rendering
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-lg font-bold text-foreground mt-4 mb-2">
          {formatInlineStyles(line.substring(3))}
        </h3>
      );
      return;
    }

    if (line.trim() === '---') {
      elements.push(<hr key={index} className="my-4 border-border" />);
      return;
    }

    if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
      const text = line.trim().substring(2);
      elements.push(
        <div key={index} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-primary mt-1">•</span>
          <span>{formatInlineStyles(text)}</span>
        </div>
      );
      return;
    }

    const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      elements.push(
        <div key={index} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-primary font-medium min-w-[1.5rem]">{numberedMatch[1]}.</span>
          <span>{formatInlineStyles(numberedMatch[2])}</span>
        </div>
      );
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    elements.push(
      <p key={index} className="my-1">{formatInlineStyles(line)}</p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
};

const formatInlineStyles = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(formatLinksAndItalics(remaining.substring(0, boldMatch.index), key++));
      }
      parts.push(<strong key={key++} className="font-bold">{formatLinksAndItalics(boldMatch[1], key++)}</strong>);
      remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      continue;
    }
    parts.push(formatLinksAndItalics(remaining, key++));
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
};

const formatLinksAndItalics = (text: string, baseKey: number): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = baseKey * 1000;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(formatItalics(remaining.substring(0, linkMatch.index), key++));
      }
      parts.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkMatch.index + linkMatch[0].length);
      continue;
    }
    parts.push(formatItalics(remaining, key++));
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
};

const formatItalics = (text: string, baseKey: number): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = baseKey * 1000;

  while (remaining.length > 0) {
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.substring(0, italicMatch.index)}</span>);
      }
      parts.push(<em key={key++} className="italic">{italicMatch[1]}</em>);
      remaining = remaining.substring(italicMatch.index + italicMatch[0].length);
      continue;
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
};

/**
 * Basic HTML sanitization - allow only safe tags and attributes
 */
function sanitizeHtml(html: string): string {
  const allowedTags = ['h3', 'h2', 'h1', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'div', 'span'];
  const allowedAttrs = ['href', 'target', 'rel', 'class', 'style'];
  
  // Remove script tags and event handlers
  let clean = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/on\w+="[^"]*"/gi, '');
  clean = clean.replace(/on\w+='[^']*'/gi, '');
  clean = clean.replace(/javascript:/gi, '');
  
  return clean;
}
