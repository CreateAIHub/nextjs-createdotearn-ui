import { NextResponse } from 'next/server';

// Mock job history for demonstration
export async function GET() {
  const jobs = [
    {
      id: 'job_001',
      agentName: 'Cardano Expert',
      status: 'completed',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      duration: 2.1,
      payment: 0.5
    },
    {
      id: 'job_002', 
      agentName: 'DeFi Analyst',
      status: 'completed',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      duration: 3.2,
      payment: 0.8
    },
    {
      id: 'job_003',
      agentName: 'Midnight Specialist',
      status: 'running',
      timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    }
  ];
  
  return NextResponse.json(jobs);
}