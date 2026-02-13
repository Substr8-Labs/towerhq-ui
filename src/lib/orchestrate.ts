/**
 * Control Tower Orchestration Client
 * Triggers full C-Suite analysis from the chat UI
 */

export interface OrchestrationResult {
  success: boolean;
  request: string;
  results: Array<{
    id: string;
    name: string;
    emoji: string;
    role: string;
    verdict: string;
    output: string;
    durationMs: number;
  }>;
  totalDurationMs: number;
}

/**
 * Check if a message is an orchestration command
 */
export function isOrchestrationCommand(message: string): boolean {
  const trimmed = message.trim().toLowerCase();
  return trimmed.startsWith('/strategy') || 
         trimmed.startsWith('/csuite') ||
         trimmed.startsWith('/analyze');
}

/**
 * Extract the idea from an orchestration command
 */
export function extractIdea(message: string): string {
  return message
    .replace(/^\/(strategy|csuite|analyze)\s*/i, '')
    .trim();
}

/**
 * Call the orchestration API
 */
export async function orchestrate(idea: string): Promise<OrchestrationResult> {
  const response = await fetch('/api/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: idea })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Orchestration failed');
  }

  return response.json();
}

/**
 * Format orchestration results for chat display
 */
export function formatResults(result: OrchestrationResult): string {
  // Summary card at top
  const verdicts = result.results.map(r => {
    const emoji = r.verdict === 'GREEN' ? '✅' : r.verdict === 'YELLOW' ? '⚠️' : '🚫';
    return `${r.emoji} **${r.name}**: ${emoji}`;
  }).join('  •  ');

  const overallGreen = result.results.filter(r => r.verdict === 'GREEN').length;
  const overallYellow = result.results.filter(r => r.verdict === 'YELLOW').length;
  const overallRed = result.results.filter(r => r.verdict === 'RED').length;
  
  let overallVerdict = '🟢 **GO**';
  if (overallRed > 0) overallVerdict = '🔴 **NO-GO**';
  else if (overallYellow >= 2) overallVerdict = '🟡 **PROCEED WITH CAUTION**';

  const header = `# 🏢 Strategy Brief

> **${result.request}**

## Quick Verdict: ${overallVerdict}

${verdicts}

---

`;

  // Detailed sections - extract just the key points
  const sections = result.results.map(r => {
    const emoji = r.verdict === 'GREEN' ? '✅' : r.verdict === 'YELLOW' ? '⚠️' : '🚫';
    
    // Extract just the assessment line and first key points
    const lines = r.output.split('\n').filter(l => l.trim());
    const assessment = lines.find(l => l.includes('Assessment:') || l.includes('Readiness:') || l.includes('Viability:')) || '';
    
    return `### ${r.emoji} ${r.name} (${r.role}) ${emoji}

${r.output}
`;
  }).join('\n---\n\n');

  const footer = `
---
⏱️ *Completed in ${(result.totalDurationMs / 1000).toFixed(1)}s*`;

  return header + sections + footer;
}

/**
 * Format results as a summary table
 */
export function formatSummary(result: OrchestrationResult): string {
  const header = `🏢 **C-Suite Analysis Complete**\n\n`;
  
  const table = result.results.map(r => {
    const verdictEmoji = r.verdict === 'GREEN' ? '✅' : r.verdict === 'YELLOW' ? '🟡' : '🔴';
    return `${r.emoji} **${r.name}** (${r.role}): ${verdictEmoji} ${r.verdict}`;
  }).join('\n');

  const time = `\n\n⏱️ ${(result.totalDurationMs / 1000).toFixed(1)}s total`;

  return header + table + time;
}
