import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const personas = {
  ada: {
    id: 'ada',
    name: 'Ada',
    emoji: '✦',
    role: 'CTO',
    prompt: `You are Ada, CTO. Be extremely concise.

Assess this startup idea technically:
• **Stack**: What to build with (1 line)
• **Timeline**: MVP estimate (1 line)  
• **Risk**: Biggest technical challenge (1 line)
• **Verdict**: GREEN (straightforward) / YELLOW (challenging) / RED (very hard)

Format:
**Stack:** [answer]
**Timeline:** [answer]
**Risk:** [answer]

**Technical Assessment: [GREEN/YELLOW/RED]**

Max 80 words total.`
  },
  grace: {
    id: 'grace',
    name: 'Grace',
    emoji: '🚀',
    role: 'CPO',
    prompt: `You are Grace, CPO. Be extremely concise.

Assess product-market fit:
• **Problem**: Core pain point (1 line)
• **ICP**: Who exactly buys this (1 line)
• **MVP**: 3 must-have features only
• **Verdict**: GREEN (clear need) / YELLOW (needs validation) / RED (unclear problem)

Format:
**Problem:** [answer]
**ICP:** [answer]  
**MVP:** [3 bullets]

**Product Readiness: [GREEN/YELLOW/RED]**

Max 80 words total.`
  },
  tony: {
    id: 'tony',
    name: 'Tony',
    emoji: '🔥',
    role: 'CMO',
    prompt: `You are Tony, CMO. Be extremely concise.

Assess go-to-market:
• **Hook**: One-liner pitch (1 sentence)
• **Channel**: #1 launch channel and why (1 line)
• **First Move**: Day 1 action (1 line)
• **Verdict**: GREEN (clear path) / YELLOW (needs testing) / RED (crowded/unclear)

Format:
**Hook:** [answer]
**Channel:** [answer]
**First Move:** [answer]

**GTM Readiness: [GREEN/YELLOW/RED]**

Max 80 words total.`
  },
  val: {
    id: 'val',
    name: 'Val',
    emoji: '📊',
    role: 'CFO',
    prompt: `You are Val, CFO. Be extremely concise.

Assess financials:
• **Model**: How it makes money (1 line)
• **Unit Economics**: CAC vs LTV gut check (1 line)
• **Runway Risk**: Burn concern level (1 line)
• **Verdict**: GREEN (solid) / YELLOW (watch closely) / RED (dangerous)

Format:
**Model:** [answer]
**Unit Economics:** [answer]
**Runway Risk:** [answer]

**Financial Viability: [GREEN/YELLOW/RED]**

Max 80 words total.`
  }
};

const executionOrder = ['ada', 'grace', 'tony', 'val'] as const;

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  
  if (!message) {
    return new Response(JSON.stringify({ error: 'Message required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const client = new OpenAI({ apiKey });
  const encoder = new TextEncoder();
  const startTime = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      const results: Array<{ verdict: string }> = [];
      
      for (const personaId of executionOrder) {
        const persona = personas[personaId];
        
        // Send "thinking" event
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'thinking', 
          name: persona.name,
          emoji: persona.emoji,
          role: persona.role
        })}\n\n`));

        try {
          const response = await client.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 512,
            messages: [
              { role: 'system', content: persona.prompt },
              { role: 'user', content: `Startup idea: ${message}` }
            ]
          });

          const output = response.choices[0]?.message?.content || '';
          const verdict = output.match(/(GREEN|YELLOW|RED)/)?.[1] || 'YELLOW';
          results.push({ verdict });

          // Send exec result
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'exec',
            id: persona.id,
            name: persona.name,
            emoji: persona.emoji,
            role: persona.role,
            verdict,
            output
          })}\n\n`));

        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error',
            name: persona.name,
            error: String(error)
          })}\n\n`));
        }
      }

      // Send summary
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
        type: 'summary',
        totalMs: Date.now() - startTime,
        verdicts: results.map(r => r.verdict)
      })}\n\n`));

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
