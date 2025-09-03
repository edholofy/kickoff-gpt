import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/providers';

export async function GET(request: NextRequest) {
  try {
    // Check session
    const session = await auth();
    
    // Check models
    const models = [];
    try {
      const gpt5Model = myProvider.languageModel('gpt-5');
      models.push({ id: 'gpt-5', status: 'available', model: !!gpt5Model });
    } catch (error) {
      models.push({ 
        id: 'gpt-5', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
    
    try {
      const grok4Model = myProvider.languageModel('grok-4');
      models.push({ id: 'grok-4', status: 'available', model: !!grok4Model });
    } catch (error) {
      models.push({ 
        id: 'grok-4', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }

    // Check SportMonks
    let sportmonksStatus = 'not tested';
    try {
      const token = process.env.SPORTMONKS_API_TOKEN;
      if (token) {
        const testUrl = `https://api.sportmonks.com/v3/football/leagues?api_token=${token}&per_page=1`;
        const response = await fetch(testUrl);
        sportmonksStatus = response.ok ? 'working' : `error: ${response.status}`;
      } else {
        sportmonksStatus = 'no token';
      }
    } catch (error) {
      sportmonksStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`;
    }

    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          type: session.user.type
        } : null
      },
      models,
      sportmonks: sportmonksStatus,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: !!process.env.VERCEL,
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
        XAI_API_KEY: !!process.env.XAI_API_KEY,
        AI_GATEWAY_API_KEY: !!process.env.AI_GATEWAY_API_KEY,
        SPORTMONKS_API_TOKEN: !!process.env.SPORTMONKS_API_TOKEN,
        AUTH_SECRET: !!process.env.AUTH_SECRET,
        POSTGRES_URL: !!process.env.POSTGRES_URL
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Debug POST endpoint working',
      receivedBody: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}