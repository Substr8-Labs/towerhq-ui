"use client";

/**
 * Ori Assistant Panel
 * 
 * Slide-in panel from the right side for contextual help.
 * Project-aware - knows what project you're working on.
 */

import { useState, useRef, useCallback } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssistantPanelProps {
  projectName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_WIDTH = 320;
const DEFAULT_WIDTH = 400;
const MAX_WIDTH_VW = 80;

export function AssistantPanel({ projectName, isOpen, onClose }: AssistantPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const isResizing = useRef(false);

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Connect to actual AI backend
    // For now, simulate a response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I understand you're asking about "${content}". ${projectName ? `In the context of "${projectName}", ` : ''}I'd recommend using the /strategy command in the main chat to get a full C-Suite analysis. Is there anything specific you'd like help with?`
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Resize handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = panelWidth;
    const maxWidth = window.innerWidth * (MAX_WIDTH_VW / 100);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = startX - e.clientX;
      const newWidth = Math.min(maxWidth, Math.max(MIN_WIDTH, startWidth + delta));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panelWidth]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 bottom-0 z-50
          bg-zinc-900 border-l border-zinc-700
          transform transition-transform duration-300 ease-out
          flex flex-col shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: `${panelWidth}px`, maxWidth: `${MAX_WIDTH_VW}vw` }}
        role="dialog"
        aria-label="Ori Assistant"
        aria-hidden={!isOpen}
      >
        {/* Resize handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-10 group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-0 w-0.5 bg-zinc-700 group-hover:bg-amber-500 transition-colors" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-amber-500">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌟</div>
            <div>
              <h2 className="font-semibold text-white">Ori</h2>
              {projectName && (
                <p className="text-xs text-amber-100/80">{projectName}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-amber-600"
            title="Close (Press O)"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-medium text-white mb-2">Hey! I'm Ori</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                I'm your project concierge. Ask me anything about your idea, 
                or let me help you get started with a strategic analysis.
              </p>
              
              {/* Quick actions */}
              <div className="mt-6 space-y-2">
                <button 
                  onClick={() => setInputValue("Help me analyze my startup idea")}
                  className="w-full text-left px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-zinc-300">Analyze my startup idea</span>
                  </div>
                </button>
                <button 
                  onClick={() => setInputValue("What can the C-Suite help me with?")}
                  className="w-full text-left px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-zinc-300">What can the C-Suite do?</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">🌟</span>
                      <span className="text-xs font-medium text-amber-400">Ori</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">Ori is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-700 p-4 bg-zinc-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Ori anything..."
              disabled={isLoading}
              className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Press Enter to send • Try "/strategy [idea]" in main chat for full analysis
          </p>
        </div>
      </div>
    </>
  );
}
