import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if token exists
    const token = process.env.SPORTMONKS_API_TOKEN;
    
    if (!token) {
      return NextResponse.json({
        error: 'SPORTMONKS_API_TOKEN not found',
        hasToken: false,
        tokenLength: 0
      }, { status: 500 });
    }

    // Test API connection with a simple endpoint
    const testUrl = `https://api.sportmonks.com/v3/football/leagues?api_token=${token}&per_page=1`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        message: data.message || 'Unknown error',
        hasToken: true,
        tokenLength: token.length
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'SportMonks API is working!',
      hasToken: true,
      tokenLength: token.length,
      testData: data.data?.[0] || 'No data returned'
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      hasToken: !!process.env.SPORTMONKS_API_TOKEN,
      tokenLength: process.env.SPORTMONKS_API_TOKEN?.length || 0
    }, { status: 500 });
  }
}