# Football Betting AI - Setup Guide

This Next.js AI Chatbot template has been modified to create a professional football betting AI assistant powered by SportMonks API for real-time sports data.

## What's Been Added

### 1. SportMonks API Integration
- **Client**: `lib/sportmonks/client.ts` - Full API client with caching and error handling
- **Tools**: `lib/sportmonks/tools.ts` - AI tools for accessing football data
- **Endpoints**: Fixtures, live scores, standings, H2H, team stats, predictions, odds

### 2. Football Betting System Prompt
- Professional betting analyst persona in `lib/ai/prompts.ts`
- Detailed analysis framework for different betting markets
- Risk assessment levels and responsible gambling reminders
- Formatted response structure for clear insights

### 3. Enhanced UI Components
- **Quick Actions**: `components/football-quick-actions.tsx` - 8 football-specific quick actions
- **Updated Suggestions**: Football-focused chat suggestions
- **Header Branding**: Added "⚽ Football Betting AI" indicator

### 4. AI Tools Available
- `get_fixtures` - Get matches by date, team, or league
- `get_today_matches` - Today's fixtures with odds
- `get_live_matches` - Live scores and in-play data
- `get_standings` - League tables and standings
- `get_head_to_head` - H2H records between teams
- `get_team_stats` - Team statistics and form
- `get_match_predictions` - AI-powered match predictions
- `get_match_odds` - Betting odds from bookmakers
- `search_team` - Find teams by name
- `get_league_info` - League information

## Setup Instructions

### 1. Get SportMonks API Key
1. Sign up at [SportMonks.com](https://www.sportmonks.com/)
2. Choose a plan (Free tier available for testing)
3. Copy your API token from the dashboard

### 2. Configure Environment Variables
Add to your `.env.local`:
```env
SPORTMONKS_API_TOKEN=your_sportmonks_api_key_here
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Run Database Migrations
```bash
pnpm db:migrate
```

### 5. Start Development Server
```bash
pnpm dev
```

## Usage Examples

### Quick Actions Available
- **Live Matches** - Real-time scores and in-play opportunities
- **Today's Fixtures** - Analysis of today's matches
- **Premier League** - Standings and fixture analysis
- **Value Bets** - Best value opportunities across leagues
- **Team Comparison** - Detailed H2H analysis
- **Weekend Fixtures** - Weekend match recommendations
- **Underdog Picks** - High-value underdog opportunities
- **Form Analysis** - Team form-based betting suggestions

### Sample Prompts
- "Analyze Manchester United vs Liverpool and suggest best bets"
- "Show me today's matches with over 2.5 goals potential"
- "Find value bets in the Championship this weekend"
- "Compare Real Madrid and Barcelona's recent form"
- "What are the live scores and good in-play bets?"
- "Give me Premier League title race analysis"

## Features

### Betting Markets Covered
- **1X2** - Match result (Home/Draw/Away)
- **Over/Under Goals** - Total goals predictions
- **BTTS** - Both Teams to Score
- **Asian Handicap** - Spread betting
- **Correct Score** - Exact score predictions
- **First Goal Scorer** - Player to score first

### Risk Assessment
- **Low Risk** (70%+ confidence) - Strong statistical backing
- **Medium Risk** (50-70%) - Good indicators with some uncertainty
- **High Risk** (30-50%) - Speculative but potential value
- **Avoid** (<30%) - Too uncertain to recommend

### Data Sources
- Real-time match data from SportMonks API
- Historical statistics and H2H records
- League standings and form tables
- Betting odds from multiple bookmakers
- AI-powered match predictions

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `AUTH_SECRET`
   - `SPORTMONKS_API_TOKEN`
   - Database and storage tokens (auto-configured)
4. Deploy

### Important Notes
- API rate limits apply based on SportMonks plan
- Caching implemented to optimize API usage
- Live data refreshes every 30 seconds
- Historical data cached for 24 hours

## Responsible Gambling
This AI assistant includes reminders about responsible gambling:
- Only bet what you can afford to lose
- Set betting limits
- Take regular breaks
- Seek help if gambling becomes a problem

## Support
For issues or questions:
- SportMonks API: [docs.sportmonks.com](https://docs.sportmonks.com)
- Next.js AI SDK: [sdk.vercel.ai](https://sdk.vercel.ai)
- Template Issues: GitHub Issues