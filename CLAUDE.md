# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm dev              # Start development server with Turbo at localhost:3000
pnpm build            # Run database migrations + production build
pnpm start            # Start production server

# Database Operations
pnpm db:generate      # Generate Drizzle migrations from schema changes
pnpm db:migrate       # Apply pending migrations to database
pnpm db:studio        # Open Drizzle Studio for database exploration
pnpm db:push          # Push schema changes directly (dev only)
pnpm db:pull          # Pull schema from database

# Code Quality
pnpm lint             # Run Next.js linter + Biome checks
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Biome

# Testing
pnpm test             # Run Playwright E2E tests
```

## Architecture Overview

This is **Kickoff GPT**, a Next.js 15 AI-powered football betting assistant using App Router. Built as a specialized AI chatbot for **football betting analysis**, it integrates with SportMonks API for real-time sports data and provides professional betting insights.

### Core Stack
- **Next.js 15** (canary) with App Router
- **TypeScript** with strict mode
- **Drizzle ORM** with PostgreSQL
- **NextAuth.js v5** for authentication
- **AI SDK** for multi-provider LLM integration
- **SportMonks API** for real-time football data
- **shadcn/ui** + Tailwind CSS for UI
- **Biome** for linting/formatting (replaces ESLint/Prettier)

### Key Architectural Patterns

#### Database Schema Evolution
The project uses a versioned schema approach in `lib/db/schema.ts`:
- Current schema (v2) uses message parts for flexible content
- Deprecated v1 schema maintained for backward compatibility
- Messages store content as JSON parts array supporting text, code, and tool responses

#### AI Provider Integration
Located in `lib/ai/`:
- Primary provider: xAI (Grok models) with GPT-5 fallback
- Configurable via environment variables
- Unified interface through Vercel AI SDK
- Support for streaming responses and tool calls
- Custom football betting system prompt in `lib/ai/prompts.ts`

#### SportMonks API Integration
Located in `lib/sportmonks/`:
- Full API client with caching and error handling (`client.ts`)
- Comprehensive AI tools for football data access (`tools.ts`)
- Real-time fixtures, live scores, standings, odds, and predictions
- Team statistics, head-to-head records, and match analysis

#### Authentication Flow
- Middleware-based route protection in `middleware.ts`
- Guest user support with automatic creation
- Protected routes require authentication
- Session management through NextAuth.js

#### Component Architecture
- Server components by default in App Router
- Client components marked with "use client"
- Shared components in `components/` directory
- Custom hooks in `hooks/` for reusable logic

### Database Migration Strategy
1. Schema changes go in `lib/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`
4. Build process automatically runs migrations

### Environment Variables
Essential variables for development:
- `AUTH_SECRET` - Required for NextAuth
- `POSTGRES_URL` - Database connection
- `BLOB_READ_WRITE_TOKEN` - File storage
- `REDIS_URL` - Session/cache storage
- `AI_GATEWAY_API_KEY` - For non-Vercel deployments
- `SPORTMONKS_API_TOKEN` - Required for football data (get from sportmonks.com)
- `OPENAI_API_KEY` - Optional for GPT models
- `XAI_API_KEY` - Optional for Grok models

### Testing Approach
- E2E tests in `tests/` using Playwright
- Tests organized by route/feature
- Run against development server

### Football Betting AI Features

#### Available AI Tools
The application includes specialized AI tools for football analysis in `lib/sportmonks/tools.ts`:
- `get_fixtures` - Get matches by date, team, or league
- `get_today_matches` - Today's fixtures with odds
- `get_live_matches` - Live scores and in-play data
- `get_standings` - League tables and standings
- `get_head_to_head` - Historical head-to-head records
- `get_team_stats` - Team statistics and current form
- `get_match_predictions` - AI-powered match predictions
- `get_match_odds` - Real-time betting odds from bookmakers
- `search_team` - Find teams by name or ID
- `get_league_info` - League information and details

#### UI Customizations
- **Quick Actions**: `components/football-quick-actions.tsx` - 8 football-specific quick actions
- **Updated Branding**: Football betting AI indicators in header
- **Custom Suggestions**: Football-focused chat suggestions and prompts

#### Professional Betting Analysis
- Comprehensive betting system prompt with risk assessment
- Multiple betting markets coverage (1X2, Over/Under, BTTS, etc.)
- Responsible gambling reminders and disclaimers
- Formatted analysis with clear insights and recommendations

### Deployment
- Optimized for modern hosting platforms (Vercel, Railway, etc.)
- Automatic migration runner in build process
- Compatible with PostgreSQL and blob storage providers
- Health check at `/api/health`
- Requires SportMonks API subscription for full functionality