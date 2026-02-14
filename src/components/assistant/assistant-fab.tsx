"use client";

/**
 * Floating Action Button for toggling the Ori Assistant panel
 * Positioned in bottom-left corner (opposite to typical chat widgets)
 */

import { MessageCircle, X } from 'lucide-react';

interface AssistantFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AssistantFAB({ onClick, isOpen }: AssistantFABProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 left-6 z-50 
        w-14 h-14 rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-200 
        hover:-translate-y-0.5 active:translate-y-0.5
        flex items-center justify-center
        ${isOpen 
          ? 'bg-zinc-700 hover:bg-zinc-600' 
          : 'bg-amber-500 hover:bg-amber-600'
        }
      `}
      title={isOpen ? 'Close Ori (Press O)' : 'Ask Ori (Press O)'}
      aria-label={isOpen ? 'Close Ori' : 'Open Ori'}
    >
      {isOpen ? (
        <X size={24} className="text-white" />
      ) : (
        <span className="text-2xl">🌟</span>
      )}
    </button>
  );
}
