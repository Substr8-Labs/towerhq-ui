"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users, FileText, ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    imageUrl?: string | null;
    createdAt: Date;
    channels: { id: string }[];
    members: { id: string }[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Get first letter for avatar fallback
  const initial = project.name.charAt(0).toUpperCase();
  
  // Generate a consistent color based on project name
  const colors = [
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-cyan-500',
  ];
  const colorIndex = project.name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <Link href={`/servers/${project.id}`}>
      <div className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-5 transition-all group cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Project avatar */}
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center text-white text-xl font-bold`}>
              {initial}
            </div>
          )}
          
          {/* Project info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
            
            <p className="text-sm text-zinc-500 mt-1">
              Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{project.channels.length} channels</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Users className="w-3.5 h-3.5" />
                <span>{project.members.length} members</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team avatars preview */}
        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs border-2 border-zinc-800" title="Ori">🌟</div>
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs border-2 border-zinc-800" title="Ada">✦</div>
              <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs border-2 border-zinc-800" title="Grace">🚀</div>
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs border-2 border-zinc-800" title="Tony">🔥</div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs border-2 border-zinc-800" title="Val">📊</div>
            </div>
            <span className="text-xs text-zinc-500">AI Team Ready</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
