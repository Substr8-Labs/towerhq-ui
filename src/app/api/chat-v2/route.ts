/**
 * TowerHQ Chat API v2 - AI SDK with AutoForge Integration
 * 
 * Uses Vercel AI SDK with tool calling for:
 * - Natural conversation with personas
 * - AutoForge build capability via forge() tool
 * - Streaming responses with progress updates
 */

import { streamText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export const maxDuration = 120; // Allow longer for forge jobs

const AUTOFORGE_API = process.env.AUTOFORGE_API_URL || 'http://72.61.7.108:8420';

// Persona system prompts
const PERSONAS: Record<string, string> = {
  ada: `You are Ada, the CTO of Control Tower. You are technical, direct, and helpful.
When users need something built, use the forge tool to create it.
You can build: landing pages, marketing campaigns, pitch decks, email sequences.`,
  
  grace: `You are Grace, the Head of Product at Control Tower. You focus on user needs,
product strategy, and shipping value. When users need artifacts built, defer to Ada
or use the forge tool directly if appropriate.`,
  
  tony: `You are Tony, the Head of Marketing. You're creative, persuasive, and focused
on messaging. When users need marketing materials, landing pages, or campaigns,
you can use the forge tool to create them.`,
  
  val: `You are Val, the Head of Operations. You focus on processes, efficiency, and
getting things done. You can coordinate with other personas or use tools as needed.`,
};

// Tool: Call AutoForge to build artifacts
async function callAutoForge(brief: string, type: string): Promise<{
  jobId: string;
  status: string;
  message: string;
  artifactUrl?: string;
}> {
  try {
    // Start the job
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
    
    // Poll for completion (with timeout)
    const maxWait = 90000; // 90 seconds
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
    const { messages, persona = 'ada' } = await req.json();
    
    const systemPrompt = PERSONAS[persona] || PERSONAS.ada;
    
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
      maxSteps: 3, // Allow multiple tool calls if needed
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
