import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
    serverName?: string;
}

export function ChatWelcome({ name, type, serverName }: ChatWelcomeProps) {
  // Special Ori welcome for #general channel
  if (type === "channel" && name === "general") {
    return (
      <div className='space-y-4 px-4 mb-4'>
        {/* Ori avatar */}
        <div className='h-[75px] w-[75px] rounded-full bg-amber-500 flex items-center justify-center text-4xl'>
          🌟
        </div>
        
        {/* Welcome message */}
        <div>
          <p className="text-xl md:text-2xl font-bold text-white">
            Welcome to {serverName || 'your project'}!
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            I'm <span className="text-amber-400 font-semibold">Ori</span>, your project concierge.
          </p>
        </div>

        {/* Ori's intro */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 max-w-2xl">
          <p className="text-zinc-300 mb-3">
            I'll help you get started and assemble the right team for your idea.
          </p>
          
          <p className="text-zinc-300 mb-3">
            <strong className="text-white">Here's how this works:</strong>
          </p>
          
          <ol className="text-zinc-300 space-y-2 mb-4 list-decimal list-inside">
            <li>Tell me about your idea in the chat below</li>
            <li>I'll bring in the C-Suite to analyze it:</li>
          </ol>

          <div className="flex flex-wrap gap-2 ml-4 mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
              ✦ Ada <span className="text-zinc-500">CTO</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-sm">
              🚀 Grace <span className="text-zinc-500">CPO</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
              🔥 Tony <span className="text-zinc-500">CMO</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
              📊 Val <span className="text-zinc-500">CFO</span>
            </span>
          </div>

          <p className="text-zinc-400 text-sm">
            <strong className="text-zinc-300">Ready?</strong> Just type your idea below, or use <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-indigo-400">/strategy [your idea]</code> for a quick analysis.
          </p>
        </div>
      </div>
    )
  }

  // Default welcome for other channels
  return (
    <div className='space-y-2 px-4 mb-4'>
        {type === "channel" && (
            <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
                <Hash className='text-white h-12 w-12'/>
            </div>
        )}
        <p className="text-xl md:text-3xl font-bold">
            {type === "channel" ? "Welcome to #" : ""}{name}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {type === "channel" ? `This is the start of the #${name} channel.` : `This is the start of the conversation with ${name}.`}
        </p>
    </div>
  )
}
