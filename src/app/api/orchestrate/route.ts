import { NextRequest, NextResponse } from 'next/server';
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
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const results: Array<{
      persona: typeof personas[keyof typeof personas];
      output: string;
      durationMs: number;
    }> = [];

    // Sequential execution with context passing
    for (const personaId of executionOrder) {
      const persona = personas[personaId];
      const startTime = Date.now();

      // Build context from prior results
      let userMessage = `Startup idea: ${message}`;
      if (results.length > 0) {
        const context = results
          .map(r => `## ${r.persona.emoji} ${r.persona.name} (${r.persona.role})\n${r.output}`)
          .join('\n\n---\n\n');
        userMessage += `\n\n---\n\nContext from other executives:\n${context}`;
      }

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: persona.prompt },
          { role: 'user', content: userMessage }
        ]
      });

      const output = response.choices[0]?.message?.content || '';

      results.push({
        persona,
        output,
        durationMs: Date.now() - startTime
      });
    }

    // Build summary
    const summary = results.map(r => {
      const verdict = r.output.match(/(GREEN|YELLOW|RED)/)?.[1] || 'N/A';
      return {
        id: r.persona.id,
        name: r.persona.name,
        emoji: r.persona.emoji,
        role: r.persona.role,
        verdict,
        output: r.output,
        durationMs: r.durationMs
      };
    });

    const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0);

    return NextResponse.json({
      success: true,
      request: message,
      results: summary,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      { error: 'Orchestration failed', details: String(error) },
      { status: 500 }
    );
  }
}
