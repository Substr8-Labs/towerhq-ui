/**
 * AutoForge API Proxy
 * 
 * Proxies requests from TowerHQ frontend to AutoForge backend on VPS.
 * Routes:
 *   GET  /api/autoforge?action=projects     → List projects
 *   GET  /api/autoforge?action=status&project=X  → Project status
 *   POST /api/autoforge (action=create)     → Create project with spec
 *   POST /api/autoforge (action=plan)       → Generate tasks
 *   POST /api/autoforge (action=build)      → Build next task
 */

import { NextRequest, NextResponse } from 'next/server';

// AutoForge API on VPS via Tailscale funnel
const AUTOFORGE_API = process.env.AUTOFORGE_API_URL || 'https://srv1338949.tail2b522f.ts.net/autoforge';

async function proxyToAutoForge(path: string, options: RequestInit = {}) {
  const url = `${AUTOFORGE_API}${path}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('AutoForge proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AutoForge backend', details: String(error) },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const project = searchParams.get('project');
  
  switch (action) {
    case 'projects':
      return proxyToAutoForge('/projects');
    
    case 'status':
      if (!project) {
        return NextResponse.json({ error: 'Missing project parameter' }, { status: 400 });
      }
      return proxyToAutoForge(`/projects/${project}/status`);
    
    case 'artifacts':
      if (!project) {
        return NextResponse.json({ error: 'Missing project parameter' }, { status: 400 });
      }
      return proxyToAutoForge(`/projects/${project}/artifacts`);
    
    case 'health':
      return proxyToAutoForge('/health');
    
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, project, name, spec } = body;
  
  switch (action) {
    case 'create':
      if (!name || !spec) {
        return NextResponse.json({ error: 'Missing name or spec' }, { status: 400 });
      }
      return proxyToAutoForge('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, spec }),
      });
    
    case 'plan':
      if (!project) {
        return NextResponse.json({ error: 'Missing project' }, { status: 400 });
      }
      return proxyToAutoForge(`/projects/${project}/plan`, {
        method: 'POST',
      });
    
    case 'build':
      if (!project) {
        return NextResponse.json({ error: 'Missing project' }, { status: 400 });
      }
      return proxyToAutoForge(`/projects/${project}/build`, {
        method: 'POST',
      });
    
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
