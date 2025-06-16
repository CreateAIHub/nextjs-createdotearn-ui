import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

// Masumi Network Registry Service
const MASUMI_REGISTRY_URL = 'http://registry.masumi.network';
const MASUMI_PAYMENT_URL = 'https://payment.masumi.network'; // Update when available

interface MasumiAgent {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  price?: number;
  paymentAddress?: string;
  inputSchema?: any;
}

// Fetch live agents from Masumi Registry
async function fetchMasumiAgents(): Promise<MasumiAgent[]> {
  try {
    const response = await fetch(`${MASUMI_REGISTRY_URL}/agents`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn('Masumi Registry not available, using fallback agents');
      return getFallbackAgents();
    }
    
    const agents = await response.json();
    return agents.map((agent: any) => ({
      id: agent.id || agent.agentId,
      name: agent.name || agent.title,
      description: agent.description,
      baseUrl: agent.serviceUrl || agent.endpoint,
      price: agent.price,
      paymentAddress: agent.paymentAddress,
      inputSchema: agent.inputSchema
    }));
  } catch (error) {
    console.error('Error fetching Masumi agents:', error);
    return getFallbackAgents();
  }
}

// Fallback agents for testing
// Add to existing file
function getFallbackAgents(): MasumiAgent[] {
  return [
    {
      id: 'cardano-expert',
      name: 'Cardano Expert',
      baseUrl: 'https://cardano-agent.example.com',
      description: 'Specialized in Cardano blockchain operations and ADA transactions'
    },
    {
      id: 'defi-analyst', 
      name: 'DeFi Analyst',
      baseUrl: 'https://defi-agent.example.com',
      description: 'Expert in decentralized finance protocols and yield farming'
    },
    {
      id: 'midnight-specialist',
      name: 'Midnight Specialist', 
      baseUrl: 'https://midnight-agent.example.com',
      description: 'Privacy-focused blockchain solutions and zero-knowledge proofs'
    },
    {
      id: 'near-defi-agent',
      name: 'NEAR DeFi Agent',
      baseUrl: 'https://near-defi-agent.shade.network',
      description: 'Specialized in NEAR Protocol DeFi operations and cross-chain transactions'
    },
    {
      id: 'shade-agent-coordinator',
      name: 'Shade Agent Coordinator',
      baseUrl: 'https://coordinator.shade.network',
      description: 'Coordinates multiple Shade Agents for complex multi-chain operations'
    },
    {
      id: 'chain-signature-agent',
      name: 'Chain Signature Agent',
      baseUrl: 'https://chain-sig.shade.network',
      description: 'Handles cross-chain transactions using NEAR Chain Signatures'
    }
  ];
}

// Call Masumi-compliant agent
async function callMasumiAgent(agent: MasumiAgent, messages: any[]): Promise<any> {
  try {
    // Check agent availability with proper timeout and error handling
    const availabilityResponse = await fetch(`${agent.baseUrl}/availability`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!availabilityResponse.ok) {
      throw new Error(`Agent ${agent.name} is not available (${availabilityResponse.status})`);
    }
    
    const availability = await availabilityResponse.json();
    if (availability.status !== 'available') {
      throw new Error(`Agent ${agent.name} status: ${availability.status}`);
    }

    // Get input schema with timeout
    const schemaResponse = await fetch(`${agent.baseUrl}/input_schema`, {
      signal: AbortSignal.timeout(3000)
    });
    const schema = await schemaResponse.json();

    // Prepare input data according to Masumi API standard
    const lastMessage = messages[messages.length - 1];
    const inputData = [
      { key: 'text', value: lastMessage.content },
      { key: 'context', value: JSON.stringify(messages.slice(-3)) },
      { key: 'agent_type', value: agent.id },
      { key: 'timestamp', value: new Date().toISOString() }
    ];

    // Start job with timeout
    const jobResponse = await fetch(`${agent.baseUrl}/start_job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_data: inputData }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!jobResponse.ok) {
      throw new Error(`Job start failed: ${jobResponse.status}`);
    }

    const jobResult = await jobResponse.json();
    const { job_id, payment_id } = jobResult;

    // Poll for job completion (Masumi API standard)
    let status = 'pending';
    let result = '';
    let attempts = 0;
    const maxAttempts = 30;

    while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`${agent.baseUrl}/status?job_id=${job_id}`);
      const statusResult = await statusResponse.json();
      
      status = statusResult.status;
      result = statusResult.result || '';
      attempts++;
    }

    if (status === 'completed') {
      return {
        success: true,
        result,
        agent: agent.name,
        job_id,
        payment_id,
        network: 'Masumi'
      };
    } else {
      throw new Error(`Job ${status}. Last result: ${result}`);
    }

  } catch (error) {
    console.error(`Masumi agent ${agent.name} error:`, error);
    // Return a more specific error for network issues
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return {
        success: false,
        error: `Agent ${agent.name} is unreachable (timeout)`,
        agent: agent.name
      };
    }
    return {
      success: false,
      error: error.message || 'Unknown error',
      agent: agent.name
    };
  }
}

// Fallback to existing Solana API
async function callSolanaAPI(messages: any[], selectedModel: string) {
  try {
    const response = await fetch('https://solanaaihackathon.onrender.com/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: selectedModel || 'gpt-3.5-turbo'
      })
    });

    if (!response.ok) {
      throw new Error(`Solana API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Solana API error:', error);
    throw error;
  }
}

// Select appropriate agent based on message content
function selectAgent(message: string, agents: MasumiAgent[]): MasumiAgent | null {
  const lowerMessage = message.toLowerCase();
  
  // Agent selection logic
  if (lowerMessage.includes('cardano') || lowerMessage.includes('ada') || lowerMessage.includes('stake')) {
    return agents.find(a => a.id === 'cardano-expert') || null;
  }
  
  if (lowerMessage.includes('defi') || lowerMessage.includes('yield') || lowerMessage.includes('liquidity')) {
    return agents.find(a => a.id === 'defi-analyst') || null;
  }
  
  if (lowerMessage.includes('privacy') || lowerMessage.includes('midnight') || lowerMessage.includes('zero-knowledge')) {
    return agents.find(a => a.id === 'midnight-specialist') || null;
  }
  
  // Default to first available agent
  return agents[0] || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, selectedModel, chatId, agentId } = body;

    console.log('Chat API called with:', { 
      messagesCount: messages?.length, 
      selectedModel, 
      chatId, 
      agentId 
    });

    // Always use Solana API for now until real Masumi agents are available
    console.log('Using Solana API (Masumi agents not yet available)');
    const response = await callSolanaAPI(messages, selectedModel);

    // Create streaming response
    const stream = new ReadableStream({
      start(controller) {
        const content = response.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
        
        const finalContent = `*[Powered by Telegram-Bitte]*\n\n${content}`;
        controller.enqueue(new TextEncoder().encode(finalContent));
        controller.close();
      }
    });

    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Update the footer message
const footerMessage = "\n\n---\n*Powered by Telegram-Bitte - NEAR Protocol, Shade Agents & Chain Signatures*";