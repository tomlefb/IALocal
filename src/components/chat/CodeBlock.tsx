import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const lines = code.split('\n');

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-border-subtle overflow-hidden',
        'bg-bg-secondary',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary border-b border-border-subtle">
        <span className="text-xs font-mono text-text-tertiary">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            'transition-colors duration-200',
            copied
              ? 'text-success'
              : 'text-text-tertiary hover:text-text-primary hover:bg-surface-hover'
          )}
          aria-label={copied ? 'Copié' : 'Copier le code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copié</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className={cn('font-mono', language && `language-${language}`)}>
            {showLineNumbers ? (
              <table className="border-collapse w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-surface/30">
                      <td className="pr-4 text-right text-text-tertiary select-none w-8 align-top">
                        {index + 1}
                      </td>
                      <td className="pl-4 border-l border-border-subtle">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
