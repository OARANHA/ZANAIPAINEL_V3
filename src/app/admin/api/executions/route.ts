import { NextRequest, NextResponse } from 'next/server';

// Mock execution data - in a real app, this would come from a database
const mockExecutions = [
  {
    id: '1',
    agentId: 'test-agent-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    input: 'Analyze this code for performance issues',
    output: 'The code has several performance optimizations that can be made...',
    duration: 2500
  },
  {
    id: '2',
    agentId: 'test-agent-1',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'completed',
    input: 'Help me debug this function',
    output: 'The issue is in the null check on line 15...',
    duration: 1800
  },
  {
    id: '3',
    agentId: 'test-agent-2',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'error',
    input: 'Create a complex algorithm',
    output: 'Error: Unable to process complex algorithm request',
    duration: 5000
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    // Filter executions by agentId if provided
    const filteredExecutions = agentId 
      ? mockExecutions.filter(exec => exec.agentId === agentId)
      : mockExecutions;

    return NextResponse.json(filteredExecutions);
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, input } = body;

    if (!agentId || !input) {
      return NextResponse.json(
        { error: 'Agent ID and input are required' },
        { status: 400 }
      );
    }

    // Create a new execution record
    const newExecution = {
      id: Date.now().toString(),
      agentId,
      timestamp: new Date().toISOString(),
      status: 'running',
      input,
      output: null,
      duration: 0
    };

    // In a real app, you would save this to a database
    // and trigger the actual agent execution
    mockExecutions.push(newExecution);

    return NextResponse.json(newExecution);
  } catch (error) {
    console.error('Error creating execution:', error);
    return NextResponse.json(
      { error: 'Failed to create execution' },
      { status: 500 }
    );
  }
}