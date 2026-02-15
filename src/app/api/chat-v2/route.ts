/**
 * TowerHQ Chat API v2 - Workspace-Aware Personas
 * 
 * Uses workspace files to build dynamic persona prompts,
 * following the OpenClaw pattern.
 */

import { streamText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { assemblePersonaPrompt } from '@/lib/workspace/prompt-assembler';

export const maxDuration = 120;

const AUTOFORGE_API = process.env.AUTOFORGE_API_URL || 'http://72.61.7.108:8420';

/**
 * Get profile for current user
 */
async function getProfile(userId: string) {
  return db.profile.findUnique({
    where: { userId },
  });
}

/**
 * Call AutoForge to build artifacts
 */
async function callAutoForge(brief: string, type: string): Promise<{
  jobId: string;
  status: string;
  message: string;
  artifactUrl?: string;
}> {
  try {
    const startResponse = await fetch(`${AUTOFORGE_API}/api/forge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief, type }),
    });
    
    if (!startResponse.ok) {
      throw new Error(`Failed to start forge job: ${startResponse.status}`);
    }
    
    const job = await startResponse.json();
    const jobId = job.id;
    
    const maxWait = 90000;
    const pollInterval = 2000;
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      const statusResponse = await fetch(`${AUTOFORGE_API}/api/forge/${jobId}`);
      const status = await statusResponse.json();
      
      if (status.status === 'complete') {
        return {
          jobId,
          status: 'complete',
          message: `✅ Build complete! Generated ${status.steps?.length || 0} steps.`,
          artifactUrl: `/api/forge/${jobId}/artifacts`,
        };
      }
      
      if (status.status === 'failed') {
        return {
          jobId,
          status: 'failed',
          message: `❌ Build failed: ${status.error || 'Unknown error'}`,
        };
      }
    }
    
    return {
      jobId,
      status: 'timeout',
      message: '⏱️ Build is taking longer than expected. Check back later.',
    };
    
  } catch (error) {
    return {
      jobId: '',
      status: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const { messages, persona = 'ada' } = await req.json();
    
    // Get profile
    const profile = await getProfile(userId);
    
    // Build persona prompt from workspace files
    let systemPrompt: string;
    
    if (profile) {
      // Use workspace-based prompt
      systemPrompt = await assemblePersonaPrompt(profile.id, persona);
      
      // Add base instructions
      systemPrompt += `\n\n---\n\n## Instructions
- Be helpful, direct, and specific
- Reference the founder's context when relevant
- When they need something built, use the forge tool
- Stay in character as ${persona.charAt(0).toUpperCase() + persona.slice(1)}
`;
    } else {
      // Fallback for users without profile
      systemPrompt = getDefaultPrompt(persona);
    }
    
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages,
      tools: {
        forge: tool({
          description: `Build an artifact (landing page, marketing campaign, pitch deck, email sequence) from a brief. 
Use this when the user asks you to create, build, or generate something.`,
          parameters: z.object({
            brief: z.string().describe('Detailed description of what to build'),
            type: z.enum(['landing_page', 'campaign', 'deck', 'email_sequence'])
              .describe('Type of artifact to build'),
          }),
          execute: async ({ brief, type }) => {
            console.log(`[forge] Building ${type}: ${brief.substring(0, 50)}...`);
            return callAutoForge(brief, type);
          },
        }),
      },
      maxSteps: 3,
    });
    
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error('[chat-v2] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

/**
 * Fallback prompts for users without workspace
 */
function getDefaultPrompt(persona: string): string {
  const defaults: Record<string, string> = {
    ada: `You are Ada, the CTO of Control Tower. You are technical, direct, and helpful.
When users need something built, use the forge tool to create it.
You can build: landing pages, marketing campaigns, pitch decks, email sequences.`,
    
    grace: `You are Grace, the Head of Product at Control Tower. You focus on user needs,
product strategy, and shipping value. When users need artifacts built, use the forge tool.`,
    
    tony: `You are Tony, the Head of Marketing. You're creative, persuasive, and focused
on messaging. When users need marketing materials, use the forge tool to create them.`,
    
    val: `You are Val, the Head of Operations. You focus on processes, efficiency, and
getting things done. You can coordinate with other personas or use tools as needed.`,
  };

  return defaults[persona] || defaults.ada;
}
