import { NextResponse } from 'next/server';

const MASUMI_REGISTRY_URL = 'http://registry.masumi.network';

// Fallback agents for development/testing
const FALLBACK_AGENTS = [
  {
    id: 'cardano-expert',
    name: 'Cardano Expert',
    description: 'Specialized in Cardano blockchain operations and ADA transactions',
    baseUrl: 'https://cardano-agent.example.com',
    price: 0.5
  },
  {
    id: 'defi-analyst',
    name: 'DeFi Analyst', 
    description: 'Expert in decentralized finance protocols and yield farming',
    baseUrl: 'https://defi-agent.example.com',
    price: 0.8
  },
  {
    id: 'midnight-specialist',
    name: 'Midnight Specialist',
    description: 'Privacy-focused blockchain solutions and zero-knowledge proofs',
    baseUrl: 'https://midnight-agent.example.com',
    price: 1.0
  }
];

export async function GET() {
  try {
    // Try to fetch from real Masumi Registry
    const response = await fetch(`${MASUMI_REGISTRY_URL}/agents`, {
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const agents = await response.json();
      return NextResponse.json(agents);
    }
  } catch (error) {
    console.warn('Masumi Registry unavailable, using fallback agents:', error);
  }
  
  // Return fallback agents
  return NextResponse.json(FALLBACK_AGENTS);
}