"use client";

import { useState } from "react";
import { X, Download, Share2, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ArtifactViewerProps {
  title: string;
  type: string;
  content: string;
  createdAt: Date;
  onClose: () => void;
  onExportNotion?: () => void;
}

export function ArtifactViewer({ 
  title, 
  type, 
  content, 
  createdAt, 
  onClose,
  onExportNotion 
}: ArtifactViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const typeColors: Record<string, string> = {
    'strategy_brief': 'bg-indigo-500',
    'project_plan': 'bg-emerald-500',
    'task_board': 'bg-amber-500',
    'prd': 'bg-pink-500',
    'custom': 'bg-zinc-500',
  };
  
  const typeLabels: Record<string, string> = {
    'strategy_brief': 'Strategy Brief',
    'project_plan': 'Project Plan',
    'task_board': 'Task Board',
    'prd': 'PRD',
    'custom': 'Document',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type] || typeColors.custom} text-white`}>
              {typeLabels[type] || 'Document'}
            </span>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="text-zinc-400 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="text-zinc-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            {onExportNotion && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onExportNotion}
                className="text-zinc-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Notion
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <article className="prose prose-invert prose-zinc max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-zinc-300 mb-3 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside text-zinc-300 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-300 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-zinc-400">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 text-zinc-400 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-indigo-400">
                    {children}
                  </code>
                ),
                hr: () => <hr className="border-zinc-700 my-6" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-700 bg-zinc-800/50">
          <span className="text-xs text-zinc-500">
            Created {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {onExportNotion && (
              <Button onClick={onExportNotion} variant="primary" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Export to Notion
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
