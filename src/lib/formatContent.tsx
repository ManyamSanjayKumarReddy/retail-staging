import React from 'react';

/**
 * Parse and render formatted content with basic markdown-style formatting
 * Supports: **bold**, *italic*, ## headings, bullet points, numbered lists, --- dividers, [links](url)
 */
export const formatContent = (content: string): React.ReactNode => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    let processedLine: React.ReactNode = line;

    // Handle headings (## Heading)
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-lg font-bold text-foreground mt-4 mb-2">
          {formatInlineStyles(line.substring(3))}
        </h3>
      );
      return;
    }

    // Handle dividers (---)
    if (line.trim() === '---') {
      elements.push(<hr key={index} className="my-4 border-border" />);
      return;
    }

    // Handle bullet points (• or -)
    if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
      const content = line.trim().substring(2);
      elements.push(
        <div key={index} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-primary mt-1">•</span>
          <span>{formatInlineStyles(content)}</span>
        </div>
      );
      return;
    }

    // Handle numbered lists (1. 2. etc)
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

    // Handle empty lines
    if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={index} className="my-1">
        {formatInlineStyles(line)}
      </p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
};

/**
 * Format inline styles: **bold**, *italic*, [links](url)
 */
const formatInlineStyles = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(formatLinksAndItalics(remaining.substring(0, boldMatch.index), key++));
      }
      parts.push(
        <strong key={key++} className="font-bold">
          {formatLinksAndItalics(boldMatch[1], key++)}
        </strong>
      );
      remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // No more bold, process the rest
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
    // Check for links [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(formatItalics(remaining.substring(0, linkMatch.index), key++));
      }
      parts.push(
        <a 
          key={key++} 
          href={linkMatch[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkMatch.index + linkMatch[0].length);
      continue;
    }

    // No more links, check for italics
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
    // Check for italics *text* (single asterisk, not double)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.substring(0, italicMatch.index)}</span>);
      }
      parts.push(
        <em key={key++} className="italic">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.substring(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // No more italics
    if (remaining) {
      parts.push(<span key={key++}>{remaining}</span>);
    }
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
};
