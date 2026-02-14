"use client";

import { Plus } from "lucide-react";
import { useStore } from "@/store/store";

interface NewProjectButtonProps {
  variant?: 'button' | 'card';
}

export function NewProjectButton({ variant = 'button' }: NewProjectButtonProps) {
  const onOpen = useStore.use.onOpen();

  if (variant === 'card') {
    return (
      <div 
        onClick={() => onOpen("createServer")}
        className="border-2 border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-zinc-500 hover:bg-zinc-800/30 transition-colors cursor-pointer min-h-[200px]"
      >
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
          <Plus className="w-6 h-6 text-zinc-400" />
        </div>
        <h3 className="font-medium text-zinc-300">New Project</h3>
        <p className="text-sm text-zinc-500 mt-1">Start a new strategic analysis</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => onOpen("createServer")}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
    >
      <Plus className="w-5 h-5" />
      New Project
    </button>
  );
}
