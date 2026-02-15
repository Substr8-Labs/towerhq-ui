/**
 * TowerHQ Prompt Assembler
 * 
 * Builds persona system prompts from workspace files,
 * following the OpenClaw pattern.
 */

import { db } from '@/lib/db';

export type WorkspaceContext = {
  founder: string | null;
  company: string | null;
  context: string | null;
  persona: {
    identity: string | null;
    soul: string | null;
    tools: string | null;
    memory: string | null;
  };
};

/**
 * Load workspace files for a profile
 */
export async function loadWorkspaceFiles(profileId: string): Promise<Map<string, string>> {
  const workspace = await db.workspace.findUnique({
    where: { profileId },
    include: { files: true },
  });

  if (!workspace) {
    return new Map();
  }

  const files = new Map<string, string>();
  for (const file of workspace.files) {
    files.set(file.path, file.content);
  }
  return files;
}

/**
 * Get workspace context for a specific persona
 */
export async function getWorkspaceContext(
  profileId: string,
  personaId: string
): Promise<WorkspaceContext> {
  const files = await loadWorkspaceFiles(profileId);

  return {
    founder: files.get('FOUNDER.md') || null,
    company: files.get('COMPANY.md') || null,
    context: files.get('CONTEXT.md') || null,
    persona: {
      identity: files.get(`personas/${personaId}/IDENTITY.md`) || null,
      soul: files.get(`personas/${personaId}/SOUL.md`) || null,
      tools: files.get(`personas/${personaId}/TOOLS.md`) || null,
      memory: files.get(`personas/${personaId}/MEMORY.md`) || null,
    },
  };
}

/**
 * Assemble the full system prompt for a persona
 */
export async function assemblePersonaPrompt(
  profileId: string,
  personaId: string
): Promise<string> {
  const ctx = await getWorkspaceContext(profileId, personaId);

  const sections: string[] = [];

  // Persona identity (who they are)
  if (ctx.persona.identity) {
    sections.push(ctx.persona.identity);
  }

  // Persona soul (how they think/behave)
  if (ctx.persona.soul) {
    sections.push(ctx.persona.soul);
  }

  // Founder context (who they're helping)
  if (ctx.founder) {
    sections.push('# Founder Context\n' + ctx.founder);
  }

  // Company context (what they're building)
  if (ctx.company) {
    sections.push('# Company Context\n' + ctx.company);
  }

  // Shared memory/context
  if (ctx.context) {
    sections.push('# Recent Context\n' + ctx.context);
  }

  // Persona-specific memory
  if (ctx.persona.memory) {
    sections.push('# My Notes\n' + ctx.persona.memory);
  }

  // Persona tools (what they can do)
  if (ctx.persona.tools) {
    sections.push('# My Capabilities\n' + ctx.persona.tools);
  }

  // If no workspace files, fall back to default
  if (sections.length === 0) {
    return getDefaultPersonaPrompt(personaId);
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Fallback prompts for personas without workspace files
 */
function getDefaultPersonaPrompt(personaId: string): string {
  const defaults: Record<string, string> = {
    ada: `You are Ada, the CTO of this founder's AI executive team. 
You are technical, direct, and helpful. You think about architecture, 
implementation, and making things work.`,
    
    grace: `You are Grace, the Head of Product. You focus on user needs,
product strategy, and shipping value. You ask "why" to understand deeply
and push for clarity.`,
    
    tony: `You are Tony, the Head of Marketing. You're creative, punchy,
and focused on messaging. You think about audiences, hooks, and distribution.`,
    
    val: `You are Val, the Head of Operations. You focus on processes,
efficiency, and risk. You keep things running and catch what others miss.`,
  };

  return defaults[personaId] || defaults.ada;
}

/**
 * Check if a profile has completed onboarding
 */
export async function hasCompletedOnboarding(profileId: string): Promise<boolean> {
  const workspace = await db.workspace.findUnique({
    where: { profileId },
  });
  return workspace?.onboardingComplete ?? false;
}
