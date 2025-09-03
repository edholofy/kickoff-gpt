import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    apiKeys: {
      SPORTMONKS_API_TOKEN: !!process.env.SPORTMONKS_API_TOKEN,
      XAI_API_KEY: !!process.env.XAI_API_KEY,
      AI_GATEWAY_API_KEY: !!process.env.AI_GATEWAY_API_KEY,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      REDIS_URL: !!process.env.REDIS_URL,
    },
    lengths: {
      SPORTMONKS_API_TOKEN: process.env.SPORTMONKS_API_TOKEN?.length || 0,
      XAI_API_KEY: process.env.XAI_API_KEY?.length || 0,
      AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY?.length || 0,
    }
  });
}