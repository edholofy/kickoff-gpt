import { tool } from 'ai';
import { z } from 'zod';
import { SportmonksClient } from '@/lib/sportmonks/client';

// Helper to get SportMonks client with runtime token
const getSportmonksClient = () => {
  const token = process.env.SPORTMONKS_API_TOKEN;
  if (!token) {
    console.error('SPORTMONKS_API_TOKEN is not configured in environment variables');
    throw new Error('SPORTMONKS_API_TOKEN is not configured. Please add it to your environment variables.');
  }
  console.log('SportMonks API token found, length:', token.length);
  return new SportmonksClient(token);
};

export const sportmonksTools = {
  get_fixtures: tool({
    description: 'Get football fixtures/matches by date, team, or league. Use this to find upcoming or past matches.',
    inputSchema: z.object({
      date: z.string().optional().describe('Date in YYYY-MM-DD format'),
      teamId: z.number().optional().describe('Team ID to filter fixtures'),
      leagueId: z.number().optional().describe('League ID to filter fixtures'),
      live: z.boolean().optional().describe('Get only live matches'),
    }),
    execute: async ({ date, teamId, leagueId, live }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.fetch({
          endpoint: live ? 'livescores' : 'fixtures',
          date,
          teamId,
          leagueId,
          include: ['participants', 'scores', 'state', 'league', 'odds']
        });
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch fixtures'
        };
      }
    },
  }),

  get_today_matches: tool({
    description: 'Get all football matches happening today with odds and predictions',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.getTodayFixtures();
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch today\'s matches'
        };
      }
    },
  }),

  get_live_matches: tool({
    description: 'Get all currently live football matches with real-time scores and events',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.getLiveMatches();
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch live matches'
        };
      }
    },
  }),

  get_standings: tool({
    description: 'Get league standings/table for a specific season',
    inputSchema: z.object({
      seasonId: z.number().describe('Season ID for standings'),
    }),
    execute: async ({ seasonId }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.fetch({
          endpoint: 'standings',
          seasonId,
          include: ['participant', 'details']
        });
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch standings'
        };
      }
    },
  }),

  get_head_to_head: tool({
    description: 'Get head-to-head record and historical matches between two teams',
    inputSchema: z.object({
      team1Id: z.number().describe('First team ID'),
      team2Id: z.number().describe('Second team ID'),
    }),
    execute: async ({ team1Id, team2Id }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.fetch({
          endpoint: 'head_to_head',
          team1Id,
          team2Id,
          include: ['participants', 'scores', 'league', 'state'],
          limit: 20
        });
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch head-to-head data'
        };
      }
    },
  }),

  get_team_stats: tool({
    description: 'Get comprehensive team statistics, form, and information',
    inputSchema: z.object({
      teamId: z.number().describe('Team ID'),
      includeForm: z.boolean().optional().default(true).describe('Include recent match results'),
    }),
    execute: async ({ teamId, includeForm }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        // Get team info and statistics
        const teamResult = await sportmonksClient.fetch({
          endpoint: 'teams',
          teamId,
          include: ['statistics', 'country', 'coach', 'venue']
        });

        let formData = null;
        if (includeForm) {
          // Get recent form (last 10 matches)
          formData = await sportmonksClient.getTeamForm(teamId, 10);
        }

        return {
          success: true,
          data: {
            team: teamResult.data,
            recentForm: formData?.data || null
          },
          meta: teamResult.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch team statistics'
        };
      }
    },
  }),

  get_match_predictions: tool({
    description: 'Get AI-powered match predictions and probabilities for a specific fixture',
    inputSchema: z.object({
      matchId: z.number().describe('Match/Fixture ID'),
    }),
    execute: async ({ matchId }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.getMatchPredictions(matchId);
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch match predictions'
        };
      }
    },
  }),

  get_match_odds: tool({
    description: 'Get betting odds from multiple bookmakers for a specific match',
    inputSchema: z.object({
      matchId: z.number().describe('Match/Fixture ID'),
    }),
    execute: async ({ matchId }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.getMatchOdds(matchId);
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch match odds'
        };
      }
    },
  }),

  search_team: tool({
    description: 'Search for a team by name to get its ID',
    inputSchema: z.object({
      teamName: z.string().describe('Team name to search for'),
    }),
    execute: async ({ teamName }) => {
      try {
        // Note: SportMonks requires specific endpoints for search
        // This is a simplified version - you may need to adjust based on API capabilities
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.fetch({
          endpoint: `teams/search/${encodeURIComponent(teamName)}`,
          include: ['country', 'venue']
        });
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to search for team'
        };
      }
    },
  }),

  get_league_info: tool({
    description: 'Get information about a specific league including current season',
    inputSchema: z.object({
      leagueId: z.number().describe('League ID'),
    }),
    execute: async ({ leagueId }) => {
      try {
        const sportmonksClient = getSportmonksClient();
        const result = await sportmonksClient.fetch({
          endpoint: 'leagues',
          leagueId,
          include: ['country', 'currentSeason']
        });
        return {
          success: true,
          data: result.data,
          meta: result.meta
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch league information'
        };
      }
    },
  }),
};