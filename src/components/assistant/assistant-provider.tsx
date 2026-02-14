"use client";

/**
 * Assistant Provider
 * 
 * Client component wrapper that provides the Ori assistant.
 * Add this to layouts to make Ori available throughout the app.
 */

import { OriAssistant } from './index';

interface AssistantProviderProps {
  projectName?: string;
  children: React.ReactNode;
}

export function AssistantProvider({ projectName, children }: AssistantProviderProps) {
  return (
    <>
      {children}
      <OriAssistant projectName={projectName} />
    </>
  );
}
