export interface SportmonksConfig {
  endpoint: string;
  date?: string;
  teamId?: number;
  leagueId?: number;
  matchId?: number;
  playerId?: number;
  team1Id?: number;
  team2Id?: number;
  include?: string[];
  seasonId?: number;
  live?: boolean;
  limit?: number;
}

const BASE_URL = 'https://api.sportmonks.com/v3/football';

export class SportmonksClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async fetch(config: SportmonksConfig) {
    const url = this.buildUrl(config);
    const response = await fetch(url.toString(), {
      headers: { 
        'Accept': 'application/json',
        'Authorization': `${this.token}`
      },
      next: { revalidate: this.getCacheDuration(config.endpoint) },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SportMonks API error: ${response.status} - ${errorText}`);
    }
    return response.json();
  }

  private buildUrl(config: SportmonksConfig): URL {
    const { endpoint, include, ...params } = config;
    
    // Build the base URL based on endpoint type
    let urlPath = `${BASE_URL}`;
    
    switch (endpoint) {
      case 'fixtures':
        urlPath += '/fixtures';
        if (config.date) {
          urlPath += `/date/${config.date}`;
        } else if (config.teamId) {
          urlPath += `/teams/${config.teamId}`;
        } else if (config.leagueId) {
          urlPath += `/leagues/${config.leagueId}`;
        }
        break;
      case 'livescores':
        urlPath += '/livescores/inplay';
        break;
      case 'standings':
        urlPath += `/standings/seasons/${config.seasonId}`;
        break;
      case 'head_to_head':
        urlPath += `/fixtures/head-to-head/${config.team1Id}/${config.team2Id}`;
        break;
      case 'teams':
        urlPath += `/teams/${config.teamId}`;
        break;
      case 'team_statistics':
        urlPath += `/teams/${config.teamId}/statistics`;
        break;
      case 'leagues':
        urlPath += `/leagues/${config.leagueId || ''}`;
        break;
      case 'predictions':
        urlPath += `/predictions/probabilities/fixtures/${config.matchId}`;
        break;
      case 'odds':
        urlPath += `/odds/fixtures/${config.matchId}`;
        break;
      default:
        urlPath += `/${endpoint}`;
    }

    const url = new URL(urlPath);
    
    // Add API token
    url.searchParams.append('api_token', this.token);
    
    // Add includes if provided
    if (include && include.length > 0) {
      url.searchParams.append('include', include.join(';'));
    }
    
    // Add other parameters
    if (params.limit) {
      url.searchParams.append('per_page', params.limit.toString());
    }
    
    return url;
  }

  private getCacheDuration(endpoint: string): number {
    // Different cache durations based on data type
    switch (endpoint) {
      case 'livescores':
        return 30; // 30 seconds for live data
      case 'fixtures':
      case 'odds':
        return 300; // 5 minutes for fixtures and odds
      case 'standings':
        return 3600; // 1 hour for standings
      case 'teams':
      case 'head_to_head':
        return 86400; // 24 hours for team data
      default:
        return 600; // 10 minutes default
    }
  }

  // Helper methods for common queries
  async getTodayFixtures() {
    const today = new Date().toISOString().split('T')[0];
    return this.fetch({
      endpoint: 'fixtures',
      date: today,
      include: ['participants', 'scores', 'state', 'league', 'odds']
    });
  }

  async getLiveMatches() {
    return this.fetch({
      endpoint: 'livescores',
      include: ['participants', 'scores', 'state', 'league', 'events']
    });
  }

  async getTeamForm(teamId: number, limit: number = 10) {
    return this.fetch({
      endpoint: 'fixtures',
      teamId,
      limit,
      include: ['participants', 'scores', 'state']
    });
  }

  async getMatchPredictions(matchId: number) {
    return this.fetch({
      endpoint: 'predictions',
      matchId
    });
  }

  async getMatchOdds(matchId: number) {
    return this.fetch({
      endpoint: 'odds',
      matchId,
      include: ['bookmaker', 'market']
    });
  }
}