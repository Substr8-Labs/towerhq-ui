/**
 * OpenClaw Gateway Integration
 * Routes messages to AI personas via the OpenClaw gateway RPC
 */

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
}

// TowerHQ AI Personas
export const PERSONAS: Record<string, Persona> = {
  ada: {
    id: 'ada',
    name: 'Ada ✦',
    systemPrompt: `You are Ada, the CTO of Control Tower. You're technical, direct, and warm. You help founders with architecture, implementation, and hard technical decisions. You push back on bad ideas but support good ones. Keep responses concise and actionable.`,
  },
  grace: {
    id: 'grace', 
    name: 'Grace 🚀',
    systemPrompt: `You are Grace, the CPO of Control Tower. You focus on product strategy, user experience, and what to build next. You help founders prioritize features, understand their users, and ship the right things. Keep responses focused on outcomes.`,
  },
  tony: {
    id: 'tony',
    name: 'Tony 🔥',
    systemPrompt: `You are Tony, the CMO of Control Tower. You're energetic and focused on growth, marketing, and getting the word out. You help founders with positioning, messaging, content strategy, and finding customers. Keep it punchy.`,
  },
  val: {
    id: 'val',
    name: 'Val 📊',
    systemPrompt: `You are Val, the CFO of Control Tower. You're analytical and focused on the numbers - runway, unit economics, pricing, and financial planning. You help founders make smart financial decisions. Be precise but accessible.`,
  },
};

/**
 * Detect which persona should respond based on channel name
 */
export function getPersonaForChannel(channelName: string): Persona | null {
  const normalized = channelName.toLowerCase().replace(/[^a-z]/g, '');
  
  if (normalized.includes('ada') || normalized.includes('engineering') || normalized.includes('tech')) {
    return PERSONAS.ada;
  }
  if (normalized.includes('grace') || normalized.includes('product')) {
    return PERSONAS.grace;
  }
  if (normalized.includes('tony') || normalized.includes('marketing') || normalized.includes('growth')) {
    return PERSONAS.tony;
  }
  if (normalized.includes('val') || normalized.includes('finance') || normalized.includes('ops')) {
    return PERSONAS.val;
  }
  
  return null;
}

/**
 * Call OpenClaw gateway to get AI response
 */
export async function getAIResponse(
  message: string,
  persona: Persona,
  workspaceId: string,
  channelId: string
): Promise<ChatResponse> {
  const sessionKey = `agent:towerhq:${workspaceId}:${persona.id}`;
  
  try {
    // Use the sessions_send RPC endpoint
    const response = await fetch(`${GATEWAY_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(GATEWAY_TOKEN && { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'chat.send',
        params: {
          sessionKey,
          message,
          systemPrompt: persona.systemPrompt,
          model: 'anthropic/claude-sonnet-4-20250514',
          waitForResponse: true,
          timeoutSeconds: 60,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Unknown gateway error');
    }

    return {
      success: true,
      response: data.result?.response || data.result?.content || 'No response generated',
    };
  } catch (error) {
    console.error('OpenClaw integration error:', error);
    
    // Fallback to direct OpenAI call if gateway fails
    return await getDirectAIResponse(message, persona);
  }
}

/**
 * Direct Anthropic Claude fallback when gateway is unavailable
 */
async function getDirectAIResponse(message: string, persona: Persona): Promise<ChatResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'No AI backend available (ANTHROPIC_API_KEY not set)',
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: persona.systemPrompt,
        messages: [
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      success: true,
      response: data.content?.[0]?.text || 'No response generated',
    };
  } catch (error) {
    console.error('Direct AI error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI request failed',
    };
  }
}
