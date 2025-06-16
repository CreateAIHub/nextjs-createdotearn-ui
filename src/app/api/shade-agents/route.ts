// New file needed
import { NextRequest, NextResponse } from 'next/server';

// Shade Agents configuration
const SHADE_AGENTS_REGISTRY = 'https://shade-agents-registry.near.org';

export async function GET() {
  try {
    // Fetch available Shade Agents
    const response = await fetch(`${SHADE_AGENTS_REGISTRY}/agents`);
    const agents = await response.json();
    
    return NextResponse.json({
      agents: agents.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        capabilities: agent.capabilities,
        chainSignatureSupport: agent.chainSignatureSupport
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Shade Agents' }, { status: 500 });
  }
}