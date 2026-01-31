import { useState, useMemo, useCallback, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Bot, Copy, Check, RefreshCw } from 'lucide-react';
import type { Message } from '@/types';
import { cn, formatTime } from '@/utils';
import { IconButton } from '@/components/ui';
import { CodeBlock } from './CodeBlock';

export interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

export function MessageBubble({
  message,
  onCopy,
  onRegenerate,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      onCopy?.(message.content);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [message.content, onCopy]);

  const timestamp = useMemo(() => {
    const date = message.timestamp instanceof Date
      ? message.timestamp
      : new Date(message.timestamp);
    return formatTime(date);
  }, [message.timestamp]);

  // Custom components for react-markdown
  const markdownComponents = useMemo(
    () => ({
      // Code blocks and inline code
      code: ({
        inline,
        className,
        children,
        ...props
      }: {
        inline?: boolean;
        className?: string;
        children?: ReactNode;
      }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : undefined;
        const codeContent = String(children).replace(/\n$/, '');

        if (inline) {
          return (
            <code
              className="px-1.5 py-0.5 rounded bg-bg-tertiary text-accent font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <CodeBlock
            code={codeContent}
            language={language}
            className="my-3"
          />
        );
      },
      // Paragraphs
      p: ({ children }: { children?: ReactNode }) => (
        <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
      ),
      // Lists
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="mb-3 last:mb-0 pl-4 list-disc space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="mb-3 last:mb-0 pl-4 list-decimal space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      // Headings
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h3>
      ),
      // Links
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          {children}
        </a>
      ),
      // Blockquotes
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="border-l-2 border-accent pl-4 my-3 text-text-secondary italic">
          {children}
        </blockquote>
      ),
      // Strong and emphasis
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      // Horizontal rule
      hr: () => <hr className="my-4 border-border-subtle" />,
    }),
    []
  );

  return (
    <div
      className={cn(
        'group flex gap-3 animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar for assistant */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface flex items-center justify-center">
          <Bot className="w-5 h-5 text-text-secondary" />
        </div>
      )}

      <div
        className={cn(
          'relative max-w-[80%] md:max-w-[70%]',
          isUser && 'order-first'
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-bubble-user text-white rounded-tr-sm'
              : 'bg-bubble-assistant text-text-primary rounded-tl-sm'
          )}
        >
          {isUser ? (
            // User messages: plain text
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            // Assistant messages: markdown
            <>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {/* Streaming cursor */}
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-text-primary animate-typing" />
              )}
            </>
          )}
        </div>

        {/* Actions and timestamp */}
        <div
          className={cn(
            'flex items-center gap-2 mt-1 transition-opacity duration-200',
            isUser ? 'justify-end' : 'justify-start',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Timestamp */}
          <span className="text-xs text-text-tertiary">{timestamp}</span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <IconButton
              icon={copied ? Check : Copy}
              size="sm"
              tooltip="Copier"
              onClick={handleCopy}
              className={cn(
                'h-6 w-6 p-1',
                copied && 'text-success'
              )}
            />
            {isAssistant && onRegenerate && (
              <IconButton
                icon={RefreshCw}
                size="sm"
                tooltip="Régénérer"
                onClick={onRegenerate}
                className="h-6 w-6 p-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
