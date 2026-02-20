import React, { useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Heading2, Minus, Link, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter detailed content...",
  rows = 8
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync value into editor only on external changes
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      // Convert legacy markdown to HTML if needed
      const htmlContent = convertMarkdownToHtml(value);
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      // Store as HTML
      onChange(html);
    }
  }, [onChange]);

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, '<hr class="my-4 border-border" />');
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const selection = window.getSelection();
      const text = selection?.toString() || url;
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${text}</a>`);
      handleInput();
    }
  };

  const formatActions = [
    { icon: Bold, label: 'Bold', action: () => execCommand('bold'), title: 'Bold' },
    { icon: Italic, label: 'Italic', action: () => execCommand('italic'), title: 'Italic' },
    { icon: Heading2, label: 'Heading', action: () => execCommand('formatBlock', 'h3'), title: 'Heading' },
    { icon: List, label: 'Bullet List', action: () => execCommand('insertUnorderedList'), title: 'Bullet list' },
    { icon: ListOrdered, label: 'Numbered List', action: () => execCommand('insertOrderedList'), title: 'Numbered list' },
    { icon: Minus, label: 'Divider', action: insertDivider, title: 'Horizontal divider' },
    { icon: Link, label: 'Link', action: insertLink, title: 'Insert link' },
    { icon: Undo, label: 'Undo', action: () => execCommand('undo'), title: 'Undo' },
    { icon: Redo, label: 'Redo', action: () => execCommand('redo'), title: 'Redo' },
  ];

  const minHeight = Math.max(rows * 24, 120);

  return (
    <div className="space-y-0">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted rounded-t-lg border border-b-0">
        {formatActions.map(({ icon: Icon, label, action, title }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            title={title}
            className="h-8 w-8 p-0"
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
          WYSIWYG Editor
        </span>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="w-full rounded-b-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-y-auto prose prose-sm max-w-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_hr]:my-3 [&_hr]:border-border"
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  );
};

/**
 * Convert legacy markdown content to HTML for the WYSIWYG editor.
 * If content already contains HTML tags, return as-is.
 */
function convertMarkdownToHtml(content: string): string {
  if (!content) return '';
  
  // If content already has HTML tags, it's already in new format
  if (/<[a-z][\s\S]*>/i.test(content) && !content.includes('**')) {
    return content;
  }

  // Convert markdown to HTML
  let html = content;

  // Convert headings ## text -> <h3>text</h3>
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');

  // Convert horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Convert bold **text** -> <strong>text</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert italic *text* -> <em>text</em>
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // Convert links [text](url) -> <a>text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert bullet points
  html = html.replace(/^[•\-] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Convert numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Convert remaining plain lines to paragraphs
  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('<br>');
    } else if (trimmed.startsWith('<h3>') || trimmed.startsWith('<hr') || trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>') || trimmed.startsWith('<li>')) {
      result.push(trimmed);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }

  return result.join('');
}
