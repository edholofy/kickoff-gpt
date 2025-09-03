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

This is a Next.js 15 AI chatbot application using App Router, originally based on Vercel's AI chatbot template but extensively customized.

### Core Stack
- **Next.js 15** (canary) with App Router
- **TypeScript** with strict mode
- **Drizzle ORM** with PostgreSQL
- **NextAuth.js v5** for authentication
- **AI SDK** for multi-provider LLM integration
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
- Primary provider: xAI (Grok models)
- Configurable via environment variables
- Unified interface through Vercel AI SDK
- Support for streaming responses and tool calls

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

### Testing Approach
- E2E tests in `tests/` using Playwright
- Tests organized by route/feature
- Run against development server

### Deployment
- Optimized for Vercel deployment
- Automatic migration runner in build process
- Vercel Postgres + Blob storage integration
- Health check at `/api/health`