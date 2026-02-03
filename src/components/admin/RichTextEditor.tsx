import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Heading2, Minus, Link } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText ? start + before.length + selectedText.length + after.length : start + before.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const formatActions = [
    { 
      icon: Bold, 
      label: 'Bold', 
      action: () => insertFormatting('**', '**'),
      title: 'Bold (wrap with **)'
    },
    { 
      icon: Italic, 
      label: 'Italic', 
      action: () => insertFormatting('*', '*'),
      title: 'Italic (wrap with *)'
    },
    { 
      icon: Heading2, 
      label: 'Heading', 
      action: () => insertAtLineStart('## '),
      title: 'Heading (## at start)'
    },
    { 
      icon: List, 
      label: 'Bullet List', 
      action: () => insertAtLineStart('• '),
      title: 'Bullet point (• at start)'
    },
    { 
      icon: ListOrdered, 
      label: 'Numbered List', 
      action: () => insertAtLineStart('1. '),
      title: 'Numbered list'
    },
    { 
      icon: Minus, 
      label: 'Divider', 
      action: () => insertFormatting('\n---\n'),
      title: 'Horizontal divider'
    },
    { 
      icon: Link, 
      label: 'Link', 
      action: () => insertFormatting('[', '](url)'),
      title: 'Link [text](url)'
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted rounded-t-lg border border-b-0">
        {formatActions.map(({ icon: Icon, label, action, title }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            onClick={action}
            title={title}
            className="h-8 w-8 p-0"
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
          Markdown-style formatting
        </span>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Supports: **bold**, *italic*, ## headings, • bullet lists, 1. numbered lists, --- dividers, [links](url)
      </p>
    </div>
  );
};
