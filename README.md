<div align="center">
  <img alt="Kickoff GPT - AI-powered football betting assistant" src="app/(chat)/opengraph-image.png">
  <h1 align="center">⚽ Kickoff GPT</h1>
</div>

<p align="center">
    Kickoff GPT is an AI-powered football betting assistant built with Next.js and the AI SDK, providing professional betting insights and analysis.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#football-betting-ai"><strong>Football Betting AI</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, and other model providers
- [SportMonks API](https://www.sportmonks.com) Integration
  - Real-time football data, fixtures, and live scores
  - Comprehensive team statistics and head-to-head records
  - Professional betting odds and predictions
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - PostgreSQL for saving chat history and user data
  - Blob storage for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Football Betting AI

Kickoff GPT specializes in football betting analysis with:
- **Professional Analysis**: Comprehensive betting insights across multiple markets
- **Real-time Data**: Live scores, fixtures, and up-to-date odds
- **Risk Assessment**: Built-in responsible gambling guidelines
- **Multiple Markets**: Coverage of 1X2, Over/Under, BTTS, and more
- **Team Intelligence**: Deep team statistics, form analysis, and H2H records

## Model Providers

Kickoff GPT uses multiple AI providers for optimal football analysis:

- **Primary Models**: xAI Grok models for advanced sports reasoning
- **Fallback**: OpenAI GPT models for additional capabilities
- **Custom Prompts**: Specialized football betting analysis prompts

### AI Provider Configuration

The application supports multiple AI providers configured via environment variables:
- Set `XAI_API_KEY` for Grok models
- Set `OPENAI_API_KEY` for GPT models
- Configure `AI_GATEWAY_API_KEY` for non-Vercel deployments

With the [AI SDK](https://ai-sdk.dev/docs/introduction), you can easily switch between providers or add new ones.

## Deploy Your Own

Deploy your own Kickoff GPT instance:

### Prerequisites
1. **SportMonks API**: Sign up at [sportmonks.com](https://www.sportmonks.com/) for football data
2. **Database**: PostgreSQL instance (Vercel Postgres, Neon, or others)
3. **Storage**: Blob storage for file handling
4. **AI APIs**: xAI and/or OpenAI API keys

### Quick Deploy
The easiest way is to deploy on Vercel with automatic environment variable setup.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Kickoff GPT. Copy the example file and fill in your API keys:

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
pnpm install
pnpm dev
```

Your Kickoff GPT instance should now be running on [localhost:3000](http://localhost:3000).
