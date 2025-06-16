import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

// NEAR Protocol Agent Interface
interface NEARAgent {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  price?: number;
  paymentAddress?: string;
  capabilities?: string[];
}

// Fallback NEAR agents for testing
function getFallbackAgents(): NEARAgent[] {
  return [
    {
      id: 'near-defi-agent',
      name: 'NEAR DeFi Agent',
      baseUrl: 'https://near-defi-agent.shade.network',
      description: 'Specialized in NEAR Protocol DeFi operations and cross-chain transactions',
      capabilities: ['defi', 'staking', 'yield-farming']
    },
    {
      id: 'shade-agent-coordinator',
      name: 'Shade Agent Coordinator',
      baseUrl: 'https://coordinator.shade.network',
      description: 'Coordinates multiple Shade Agents for complex multi-chain operations',
      capabilities: ['coordination', 'multi-chain', 'orchestration']
    },
    {
      id: 'chain-signature-agent',
      name: 'Chain Signature Agent',
      baseUrl: 'https://chain-sig.shade.network',
      description: 'Handles cross-chain transactions using NEAR Chain Signatures',
      capabilities: ['cross-chain', 'signatures', 'bitcoin', 'ethereum']
    },
    {
      id: 'near-intents-agent',
      name: 'NEAR Intents Agent',
      baseUrl: 'https://intents.shade.network',
      description: 'Processes user intents and executes atomic transactions',
      capabilities: ['intents', 'atomic-swaps', 'p2p-trading']
    }
  ];
}

// Call NEAR-compatible agent
async function callNEARAgent(agent: NEARAgent, messages: any[]): Promise<any> {
  try {
    // Check agent availability
    const availabilityResponse = await fetch(`${agent.baseUrl}/availability`, {
      signal: AbortSignal.timeout(3000),
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

    // Prepare input data for NEAR agent
    const lastMessage = messages[messages.length - 1];
    const inputData = {
      message: lastMessage.content,
      context: messages.slice(-3),
      agent_type: agent.id,
      timestamp: new Date().toISOString(),
      capabilities: agent.capabilities
    };

    // Call the agent
    const response = await fetch(`${agent.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Agent call failed: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      result: result.response || result.message,
      agent: agent.name,
      network: 'NEAR Protocol'
    };
  } catch (error) {
    console.error(`NEAR agent ${agent.name} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      agent: agent.name
    };
  }
}

function selectAgent(message: string, agents: NEARAgent[]): NEARAgent | null {
  const lowerMessage = message.toLowerCase();
  
  // Intent-based agent selection
  if (lowerMessage.includes('defi') || lowerMessage.includes('stake') || lowerMessage.includes('yield')) {
    return agents.find(a => a.id === 'near-defi-agent') || null;
  }
  
  if (lowerMessage.includes('cross-chain') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
    return agents.find(a => a.id === 'chain-signature-agent') || null;
  }
  
  if (lowerMessage.includes('intent') || lowerMessage.includes('swap') || lowerMessage.includes('trade')) {
    return agents.find(a => a.id === 'near-intents-agent') || null;
  }
  
  if (lowerMessage.includes('coordinate') || lowerMessage.includes('complex')) {
    return agents.find(a => a.id === 'shade-agent-coordinator') || null;
  }
  
  // Default to coordinator for complex queries
  return agents.find(a => a.id === 'shade-agent-coordinator') || agents[0];
}

export async function POST(req: NextRequest) {
  try {
    const { messages, selectedModel, chatId, agentId } = await req.json();
    
    // Get available NEAR agents
    const agents = getFallbackAgents();
    
    // Select appropriate agent based on the message
    const lastMessage = messages[messages.length - 1];
    const selectedAgent = selectAgent(lastMessage.content, agents);
    
    if (!selectedAgent) {
      return NextResponse.json({ error: 'No suitable agent found' }, { status: 400 });
    }
    
    // Try to call the NEAR agent
    const agentResult = await callNEARAgent(selectedAgent, messages);
    
    if (agentResult.success) {
      const footerMessage = "\n\n---\n*Powered by Telegram-Bitte - NEAR Protocol, Shade Agents & Chain Signatures*";
      
      return NextResponse.json({
        response: agentResult.result + footerMessage,
        agent: agentResult.agent,
        network: agentResult.network
      });
    } else {
      // Fallback to simple response
      const fallbackResponse = `I'm a NEAR Protocol assistant powered by Shade Agents. I can help you with:\n\n` +
        `• DeFi operations on NEAR\n` +
        `• Cross-chain transactions using Chain Signatures\n` +
        `• NEAR Intents for atomic swaps\n` +
        `• Multi-chain coordination\n\n` +
        `How can I assist you today?`;
      
      const footerMessage = "\n\n---\n*Powered by Telegram-Bitte - NEAR Protocol, Shade Agents & Chain Signatures*";
      
      return NextResponse.json({
        response: fallbackResponse + footerMessage,
        agent: 'Telegram-Bitte Assistant',
        network: 'NEAR Protocol'
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}