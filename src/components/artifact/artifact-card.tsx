"use client";

import { FileText, ExternalLink, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ArtifactCardProps {
  title: string;
  type: string;
  createdAt: Date;
  preview?: string;
  onClick?: () => void;
}

export function ArtifactCard({ title, type, createdAt, preview, onClick }: ArtifactCardProps) {
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
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`${typeColors[type] || typeColors.custom} p-2 rounded-lg`}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[type] || typeColors.custom} text-white`}>
              {typeLabels[type] || 'Document'}
            </span>
            <span className="text-xs text-zinc-500">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
          {preview && (
            <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
              {preview}
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>
  );
}
