import { NextResponse } from 'next/server';
import { myProvider } from '@/lib/ai/providers';
import { chatModels } from '@/lib/ai/models';

export async function GET() {
  try {
    const modelTests = [];
    
    // Test if models exist in provider
    for (const model of chatModels) {
      try {
        const languageModel = myProvider.languageModel(model.id);
        modelTests.push({
          id: model.id,
          name: model.name,
          available: !!languageModel,
          error: null
        });
      } catch (error) {
        modelTests.push({
          id: model.id,
          name: model.name,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      models: modelTests,
      environment: {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasXAI: !!process.env.XAI_API_KEY,
        hasAIGateway: !!process.env.AI_GATEWAY_API_KEY,
        isVercel: !!process.env.VERCEL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Test failed',
      models: [],
      environment: {}
    }, { status: 500 });
  }
}