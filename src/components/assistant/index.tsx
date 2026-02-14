"use client";

/**
 * Ori Assistant
 * 
 * Floating help button + slide-in panel.
 * Drop this component anywhere to add contextual Ori assistance.
 */

import { useState, useEffect } from 'react';
import { AssistantFAB } from './assistant-fab';
import { AssistantPanel } from './assistant-panel';

interface OriAssistantProps {
  projectName?: string;
}

export function OriAssistant({ projectName }: OriAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut: Press 'O' to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'o' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <AssistantFAB 
        onClick={() => setIsOpen(!isOpen)} 
        isOpen={isOpen} 
      />
      <AssistantPanel
        projectName={projectName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export { AssistantFAB } from './assistant-fab';
export { AssistantPanel } from './assistant-panel';
