import { NextResponse } from 'next/server';

// Mock stats for demonstration
// In production, this would fetch from your database or Masumi analytics service
export async function GET() {
  const stats = {
    totalAgents: 12,
    availableAgents: 9,
    totalJobs: 156,
    successfulJobs: 142,
    totalRevenue: 78.5,
    averageResponseTime: 2.3
  };
  
  return NextResponse.json(stats);
}